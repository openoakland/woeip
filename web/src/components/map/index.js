import { useEffect, useState } from "react";
import moment from "moment-timezone";
import axios from "axios";

import { useLocation } from "react-router-dom";
import { MapView } from "./view";
import { MapMenu } from "./menu";

import {
  getCollectionsOnDate,
  fallbackCollection,
  getPollutantsByCollectionId,
  getCollectionFileByLink,
  canceledCollectionsMessage,
  canceledPollutantsMessage,
} from "./utils";

import { Grid } from "../ui";

/**
 * View Map of data sessions and related meta-data
 * Data are read only
 */
export const Map = () => {
  const location = useLocation();
  const initialDate = moment(location?.state?.date) || moment(); // Date either from upload or current day
  const [mapDate, setMapDate] = useState(initialDate);
  const [collectionsOnDate, setCollectionsOnDate] = useState([]);
  const [activeCollection, setActiveCollection] = useState({});
  const [gpsFileUrl, setGpsFileUrl] = useState("");
  const [dustrakFileUrl, setDustrakFileUrl] = useState("");
  const [pollutants, setPollutants] = useState([]);
  const [isPendingResponse, setIsPendingResponse] = useState(true);
  const [pollutantsTokenSource, setPollutantsTokenSource] = useState(null); //Initialized when called by collections loader
  const [collectionsTokenSource, setCollectionsTokenSource] = useState(
    axios.CancelToken.source()
  );

  const cancelCall = (tokenSource) => tokenSource && tokenSource.cancel();

  /**
   * Load Collections on date
   */
  useEffect(() => {
    (async () => {
      try {
        const pendingCollectionsOnDate = await getCollectionsOnDate(
          mapDate,
          collectionsTokenSource
        );
        setCollectionsOnDate(pendingCollectionsOnDate);
        setActiveCollection(fallbackCollection(pendingCollectionsOnDate));
        setIsPendingResponse(true);
        setPollutantsTokenSource(axios.CancelToken.source());
      } catch (thrown) {
        canceledCollectionsMessage(thrown);
      }
    })();
    // cancel call on unmount
    return () => cancelCall(collectionsTokenSource);
  }, [mapDate, collectionsTokenSource]);

  /**
   * Load source files for collection when a new one is set
   */
  useEffect(() => {
    (async () => {
      const collectionFileLinks = activeCollection.collection_files;
      if (collectionFileLinks) {
        const [gpsFileLink, dustFileLink] = collectionFileLinks;
        try {
          const [pendingGpsFile, pendingDustrakFile] = await Promise.all([
            getCollectionFileByLink(gpsFileLink),
            getCollectionFileByLink(dustFileLink),
          ]);
          setGpsFileUrl(pendingGpsFile.file);
          setDustrakFileUrl(pendingDustrakFile.file);
        } catch {
          console.error("could not retrieve files for collection");
        }
      }
    })();
  }, [activeCollection]);

  /**
   * Load pollutants in collection
   */
  useEffect(() => {
    (async () => {
      let pendingPollutants = [];
      try {
        pendingPollutants = await getPollutantsByCollectionId(
          activeCollection.id,
          pollutantsTokenSource
        );
        setPollutants(pendingPollutants);
        setIsPendingResponse(false);
      } catch (thrown) {
        canceledPollutantsMessage(thrown);
      }
    })();
    // cancel call on unmount
    return () => cancelCall(pollutantsTokenSource);
  }, [activeCollection, pollutantsTokenSource]);

  const clearActiveCollection = () => {
    cancelCall(collectionsTokenSource);
    cancelCall(pollutantsTokenSource);
    setGpsFileUrl("");
    setDustrakFileUrl("");
    setPollutants([]);
  };

  /**
   * Load collections from a new date
   * @param {HTMLButtonEvent} event Accept the data from the calendar to start loading a date
   * @modifies {api} Cancel any pending loads
   * @modifies {isLoadingCollectionsOnDate}
   * @modifies {mapDate}
   * @modifies {cancelTokenSource}
   */
  const stageLoadingDate = async (_event, data) => {
    const rawDate = data.value;
    // guard against double click
    if (rawDate) {
      clearActiveCollection();
      setMapDate(moment(rawDate.toISOString()));
      setCollectionsTokenSource(axios.CancelToken.source());
    }
  };

  /**
   * Load a new collection from the current date
   * @param {HTMLButtonEvent} event
   * @modifies {api} Cancel any pending loads
   * @modifies {shouldLoadCollections}
   * @modifies {collection}
   * @modifies {cancelTokenSource}
   */
  const stageLoadingCollection = (pendingCollection) => {
    //guard against double click
    if (pendingCollection.id) {
      clearActiveCollection();
      setActiveCollection(pendingCollection);
      setIsPendingResponse(true);
      setPollutantsTokenSource(axios.CancelToken.source());
    }
  };

  return (
    <Grid columns={2} textAlign="left">
      <Grid.Column size="massive">
        <MapView isLoading={isPendingResponse} pollutants={pollutants} />
      </Grid.Column>
      <Grid.Column>
        <MapMenu
          mapDate={mapDate}
          collectionsOnDate={collectionsOnDate}
          activeCollection={activeCollection}
          stageLoadingDate={stageLoadingDate}
          stageLoadingCollection={stageLoadingCollection}
          gpsFileUrl={gpsFileUrl}
          dustrakFileUrl={dustrakFileUrl}
        />
      </Grid.Column>
    </Grid>
  );
};
