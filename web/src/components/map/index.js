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

import { FILE_STATES, ACTIVE_COLLECTION_ID_STATES } from "./constants";

import { Grid } from "../ui";

const initialDate = (location) => moment(location?.state?.date) || moment(); // Date either from upload or current day
export const INIT_ACTIVE_COLLECTION = {
  id: ACTIVE_COLLECTION_ID_STATES.PENDING_RESPONSE,
};

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
  const [gpsFileUrl, setGpsFileUrl] = useState(
    FILE_STATES.GPS_FILE_URL.PENDING_RESPONSE
  );
  const [dustrakFileUrl, setDustrakFileUrl] = useState(
    FILE_STATES.DUSTRAK_FILE_URL.PENDING_RESPONSE
  );
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
        // todo: set active collection to error version
      } else {
        setCollectionsOnDate(collectionsOnDateResponse);
        setActiveCollection(fallbackCollection(collectionsOnDateResponse)); // todo: update with fallback to none_found
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
      // todo: once active collection value is predictable, replace with call to messages
      if (
        !activeCollectionId ||
        activeCollectionId === ACTIVE_COLLECTION_ID_STATES.PENDING_RESPONSE
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
      if (!activeCollection.collection_files) return;
      const [gpsFileLink, dustrakFileLink] = activeCollection.collection_files;
      // pending assignment to meaningful value
      // todo: replace with check for non-valid state that prompts message
      if (gpsFileLink.file === FILE_STATES.GPS_FILE_URL.PENDING_RESPONSE)
        return;
      const [
        { file: gpsFileResponse, errorMessage: gpsFileError },
        { file: dustrakFileResponse, errorMessage: dustrakFileError },
      ] = await Promise.all([
        getCollectionFileByLink(swapProtocol(gpsFileLink)),
        getCollectionFileByLink(swapProtocol(dustrakFileLink)),
      ]);
      if (gpsFileError || dustrakFileError) {
        setErrorMessage("Error retrieving data files for collection");
        // todo: set errored version of files
      } else {
        setGpsFileUrl(swapProtocol(gpsFileResponse.file));
        setDustrakFileUrl(swapProtocol(dustrakFileResponse.file));
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
    setGpsFileUrl(FILE_STATES.GPS_FILE_URL.PENDING_RESPONSE);
    setDustrakFileUrl(FILE_STATES.DUSTRAK_FILE_URL.PENDING_RESPONSE);
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
