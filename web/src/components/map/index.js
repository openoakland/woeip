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

const initialDate = (location) => moment(location?.state?.date) || moment(); // Date either from upload or current day
const INIT_GPS_FILE_URL = "initGpsFileUrl";
const INIT_DUSTRAK_FILE_URL = "initDustrakFileUrl";
const INIT_ACTIVE_COLLECTION = {
  id: -1,
  collection_files: [
    { file: INIT_GPS_FILE_URL },
    { file: INIT_DUSTRAK_FILE_URL },
  ],
}; // Indicates that data are pending meaningful values

/**
 * View Map of data sessions and related meta-data
 * Data are read only
 */
export const Map = () => {
  const location = useLocation(); // location for the url
  const [mapDate, setMapDate] = useState(initialDate(location));
  const [collectionsOnDate, setCollectionsOnDate] = useState([]);
  const [activeCollection, setActiveCollection] = useState(
    INIT_ACTIVE_COLLECTION
  );
  const [gpsFileUrl, setGpsFileUrl] = useState(INIT_GPS_FILE_URL);
  const [dustrakFileUrl, setDustrakFileUrl] = useState(INIT_DUSTRAK_FILE_URL);
  const [pollutants, setPollutants] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPendingResponse, setIsPendingResponse] = useState(true);
  const [pollutantsTokenSource, setPollutantsTokenSource] = useState(
    axios.CancelToken.source()
  );
  const [collectionsTokenSource, setCollectionsTokenSource] = useState(
    axios.CancelToken.source()
  );

  /**
   * Invoke the cancellation of a pending axios request
   * @param {axios.CancelToken.source()} tokenSource
   * @modifies the axios call by cancelling it
   */
  const cancelCall = (tokenSource) => tokenSource && tokenSource.cancel();

  /**
   * Call the api to get collection sessions that happened on a date
   */
  useEffect(() => {
    (async () => {
      if (!mapDate) return;
      const {
        collectionsOnDate: collectionsOnDateResponse,
        errorMessage,
      } = await getCollectionsOnDate(mapDate, collectionsTokenSource);
      if (errorMessage) {
        setErrorMessage(errorMessage);
        setIsPendingResponse(false); // data loading process ends with failure to get collections
      } else {
        setCollectionsOnDate(collectionsOnDateResponse);
        setActiveCollection(fallbackCollection(collectionsOnDateResponse));
      }
    })();
    return () => cancelCall(collectionsTokenSource);
  }, [mapDate, collectionsTokenSource]);

  /**
   * Load pollutants in collection
   */
  useEffect(() => {
    (async () => {
      const activeCollectionId = activeCollection.id;
      if (
        !activeCollectionId ||
        activeCollectionId === INIT_ACTIVE_COLLECTION.id
      )
        return;
      const {
        pollutantsInCollection,
        errorMessage,
      } = await getPollutantsByCollectionId(
        activeCollectionId,
        pollutantsTokenSource
      );
      if (errorMessage) {
        setErrorMessage(errorMessage);
      } else {
        setPollutants(fallbackPollutants(pollutantsInCollection));
      }
      setIsPendingResponse(false);
    })();
    return () => cancelCall(pollutantsTokenSource);
  }, [activeCollection, pollutantsTokenSource]);

  /**
   * Call the api to load the urls for gps+dustrak source files of a collection
   */
  useEffect(() => {
    (async () => {
      try {
        const [
          gpsFileLink,
          dustrakFileLink,
        ] = activeCollection.collection_files;
        // pending assignment to meaningful value
        if (gpsFileLink.file === INIT_GPS_FILE_URL) return;
        if (!activeCollection.collection_files)
          throw new Error("Invalid data files for selected function");
        const [pendingGpsFile, pendingDustrakFile] = await Promise.all([
          getCollectionFileByLink(swapProtocol(gpsFileLink)),
          getCollectionFileByLink(swapProtocol(dustrakFileLink)),
        ]);
        if (!pendingDustrakFile.file || !pendingDustrakFile.file)
          throw new Error("missing a data file for the active collection");
        setGpsFileUrl(swapProtocol(pendingGpsFile.file));
        setDustrakFileUrl(swapProtocol(pendingDustrakFile.file));
      } catch (thrown) {
        setErrorMessage(thrown.message);
      }
    })();
  }, [activeCollection]);

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
      setMapDate(moment(rawDate.toISOString()));
      setActiveCollection(INIT_ACTIVE_COLLECTION);
      setCollectionsTokenSource(axios.CancelToken.source());
      resetCommonData();
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
      setActiveCollection(pendingCollection);
      resetCommonData();
    }
  };

  /**
   * Place functions that are common to "stageLoadingDate" and"stageLoadingCollection" into single function
   */
  const resetCommonData = () => {
    cancelCall(collectionsTokenSource);
    cancelCall(pollutantsTokenSource);
    setGpsFileUrl(INIT_GPS_FILE_URL);
    setDustrakFileUrl(INIT_DUSTRAK_FILE_URL);
    setPollutants([]);
    setErrorMessage("");
    setIsPendingResponse(true);
    setPollutantsTokenSource(axios.CancelToken.source());
  };

  return (
    <div>
      <p>collectionsOnDate: {collectionsOnDate.length}</p>
      <p>activeCollection: {activeCollection.id}</p>
      <p>gpdFileUrl: {gpsFileUrl}</p>
      <p>dustFileLink: {dustrakFileUrl}</p>
      <p>pollutants: {pollutants.length}</p>
      <p>isPendingResponse: {isPendingResponse ? "yes" : "no"}</p>
      <p>errorMessage: {errorMessage}</p>
    </div>
    // <Grid columns={2} textAlign="left">
    //   <Grid.Column size="massive">
    //     <MapBox isLoading={isPendingResponse} pollutants={pollutants} />
    //   </Grid.Column>
    //   <Grid.Column>
    //     <MapMenu
    //       mapDate={mapDate}
    //       collectionsOnDate={collectionsOnDate}
    //       activeCollection={activeCollection}
    //       stageLoadingDate={stageLoadingDate}
    //       stageLoadingCollection={stageLoadingCollection}
    //       gpsFileUrl={gpsFileUrl}
    //       dustrakFileUrl={dustrakFileUrl}
    //     />
    //   </Grid.Column>
    // </Grid>
  );
};
