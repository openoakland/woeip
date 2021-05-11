import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment-timezone";
import axios from "axios";

import { MapBox } from "./box";
import { MapMenu } from "./menu";

import {
  getCollectionsOnDate,
  fallbackCollection,
  fallbackPollutants,
  getPollutantsByCollectionId,
  getCollectionFileByLink,
  swapProtocol,
  canceledCollectionsMessage,
  canceledPollutantsMessage,
} from "./utils";

import { Grid } from "../ui";

/**
 * View Map of data sessions and related meta-data
 * Data are read only
 */
export const Map = () => {
  const location = useLocation(); // location for the url
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

  // Pair axios cancel token source function with a guard to protect calling undefined tokens
  const cancelCall = (tokenSource) => tokenSource && tokenSource.cancel();

  /**
   * Call the api to get collection sessions that happened on a date
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
    // cancel call on component unmount
    return () => cancelCall(collectionsTokenSource);
  }, [mapDate, collectionsTokenSource]);

  /**
   * Call the api to load the urls for gps+dustrak source files of a collection
   */
  useEffect(() => {
    (async () => {
      try {
        const collectionFileLinks = activeCollection.collection_files;
        const [gpsFileLink, dustFileLink] = collectionFileLinks || ["", ""];
        const [pendingGpsFile, pendingDustrakFile] = await Promise.all([
          getCollectionFileByLink(swapProtocol(gpsFileLink)),
          getCollectionFileByLink(swapProtocol(dustFileLink)),
        ]);
        setGpsFileUrl(swapProtocol(pendingGpsFile.file));
        setDustrakFileUrl(swapProtocol(pendingDustrakFile.file));
      } catch {
        console.error("could not retrieve files for collection");
      }
    })();
  }, [activeCollection]);

  /**
   * Load pollutants in collection
   */
  useEffect(() => {
    (async () => {
      try {
        const pendingPollutantValues = await getPollutantsByCollectionId(
          activeCollection.id,
          pollutantsTokenSource
        );
        setPollutants(fallbackPollutants(pendingPollutantValues));
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
        <MapBox isLoading={isPendingResponse} pollutants={pollutants} />
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
