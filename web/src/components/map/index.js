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
  const [formattedDate, setFormattedDate] = useState(initialDate.toISOString());
  const [mapDate, setMapDate] = useState(initialDate);
  const [collectionsOnDate, setCollectionsOnDate] = useState([]);
  const [activeCollection, setActiveCollection] = useState({});
  const [activeCollectionId, setActiveCollectionId] = useState(0);
  const [gpsFileUrl, setGpsFileUrl] = useState("");
  const [dustrakFileUrl, setDustrakFileUrl] = useState("");
  const [pollutants, setPollutants] = useState([]);
  const [isPendingResponse, setIsPendingResponse] = useState(true);

  /**
   * Call the api to get collection sessions that happened on a date
   */
  useEffect(() => {
    const collectionsSource = axios.CancelToken.source();
    (async () => {
      try {
        const pendingCollectionsOnDate = await getCollectionsOnDate(
          mapDate,
          collectionsSource.token,
        );
        console.log('pendingCollectionsOnDate', pendingCollectionsOnDate);
        setCollectionsOnDate(pendingCollectionsOnDate);
        const fallbackCollection = fallbackCollection(pendingCollectionsOnDate);
        console.log('fallback collection', fallbackCollection)
        setActiveCollection(fallbackCollection);
        const fallbackCollectionId = fallbackCollection.id ? fallbackCollection.id : 0;
        setActiveCollectionId(fallbackCollectionId); 
      } catch (thrown) {
        canceledCollectionsMessage(thrown);
      }
    })();
    return () => {
      console.log('cleanup collection');
      collectionsSource.cancel();
    }

 }, [formattedDate]);

  /**
   * Load pollutants in collection
   */
  useEffect(() => {
    const pollutantsSource = axios.CancelToken.source();
    if(!activeCollectionId) return;
    (async () => {
      try {
          const pendingPollutantValues = await getPollutantsByCollectionId(
            activeCollectionId,
            pollutantsSource.token,
          );
          setPollutants(fallbackPollutants(pendingPollutantValues));
          setIsPendingResponse(false);
        
      } catch (thrown) {
        canceledPollutantsMessage(thrown);
      }
    })();
    return () => {
      console.log('cleanup pollutants');
      pollutantsSource.cancel();
    }
  }, [activeCollectionId]);

  /**
   * Call the api to load the urls for gps+dustrak source files of a collection
   */
  useEffect(() => {
    const collectionFileLinks = activeCollection.collection_files;
    let collectionFilesSource;
    if(!collectionFileLinks) return;
    collectionFilesSource = axios.CancelToken.source();
    (async () => {
      try {
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
    return () => collectionFilesSource && collectionFilesSource.cancel();
  }, [activeCollectionId]);

  const clearActiveCollection = () => {
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
    console.log('click loading date')
    // guard against double click
    if (rawDate) {
      clearActiveCollection();
      const newDate = moment(rawDate.toISOString())
      setMapDate(newDate);
      setFormattedDate(newDate.format("YYYY-MM-DD"));
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
