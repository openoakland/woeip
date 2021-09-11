import axios from "axios";

import { apiUrlCollectionById, apiUrlCollections } from "../../api.util";
import { ACTIVE_COLLECTION_ID_STATES } from "./constants";

/**
 * Shape of pollutant data stored in database
 * @typedef PollutantValue
 * @property {number} value
 * @property {string} time_geo
 * @property {string} pollutant
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 * Shape of pollutant as the client wants to consume it
 * @typedef Pollutant
 * @property {string} name
 * @property {string} timestamp
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} value
 */

/**
 * Retrieve the pollutants that were detected by a given collection session
 * @param {string} collectionId the integer-like database id of the collection
 * @param {axios.CancelToken} cancelTokenSource an axios token to cancel the request
 * @returns {Array<PollutantValue>} pollutants as they are stored in the database
 */
export const getPollutantsByCollectionId = async (
  collectionId,
  cancelTokenSource
) => {
  const options = {
    cancelToken: cancelTokenSource.token,
  };
  try {
    const response = await axios.get(
      apiUrlCollectionById(collectionId),
      options
    );
    const pollutantsInCollection = response.data;
    if (!response.data)
      throw new Error("Failed to get pollutants in collection");
    return { pollutantsInCollection: pollutantsInCollection, errorMessage: "" };
  } catch (error) {
    let errorMessage = "";
    if (error.response) {
      errorMessage = "Error in server response for pollutants in collection";
    } else if (error.request) {
      errorMessage = "Error in network request for pollutants in collection";
    } else if (error.message) {
      errorMessage = error.message;
    } else if (axios.isCancel(error)) {
      // suppress message because it is not an error
      errorMessage = "";
    } else
      errorMessage = "Unknown error when retrieving pollutants in collection";
    return { pollutantsInCollection: [], errorMessage: errorMessage };
  }
};

/**
 * Extract and parse the pollutant values, or return an empty array
 * @param {Array<PollutantValue>} pollutantValueData
 */
export const fallbackPollutants = (pollutantValueData) =>
  pollutantValueData?.pollutant_values?.map(parsePollutant) || [];

/**
 * Process the pollutant data to make it consumable by the client
 * @param {PollutantValue} item the shape of the pollutant as it stored in the database
 * @returns {Pollutant} the shape of the pollutant as the client wants to consume it
 */
export const parsePollutant = (item) => {
  const timeGeoSplit = item.time_geo.split("(");
  const coordsSplit = timeGeoSplit[1].split(", ");
  return {
    timestamp: timeGeoSplit[0].trim(),
    longitude: Number(coordsSplit[0].trim()),
    latitude: Number(coordsSplit[1].replace(")", "").trim()),
    name: item.pollutant,
    value: item.value,
  };
};

/**
 * Retrieve all of the collections that occurred on the given date
 * @param {moment} mapDate
 * @param {CancelToken} cancelTokenSource
 * @returns { collectionsOnDate: Array<Collection> | errorMessage: string } validity of each value depends on whether fetch was successful
 */
export const getCollectionsOnDate = async (mapDate, cancelTokenSource) => {
  const options = {
    params: {
      start_date: mapDate.format("YYYY-MM-DD"),
    },
    cancelToken: cancelTokenSource.token,
  };
  try {
    const response = await axios.get(apiUrlCollections(), options);
    const collectionsOnDate = response.data;
    if (!collectionsOnDate) {
      throw new Error("Failed to get collections for selected date");
    } else if (!Array.isArray(collectionsOnDate)) {
      throw new Error("Received data are not in valid list form");
    }
    return { collectionsOnDate: collectionsOnDate, errorMessage: "" };
  } catch (error) {
    let errorMessage = "";
    if (error.response) {
      errorMessage = "Error in server response for collections on date";
    } else if (error.request) {
      errorMessage = "Error in network request for collections on date";
    } else if (error.message) {
      errorMessage = error.message;
    } else if (axios.isCancel(error)) {
      // suppress message because it is not an error
      errorMessage = "";
    } else errorMessage = "Unknown error when retrieving collections on date";
    return { collectionsOnDate: [], errorMessage: errorMessage };
  }
};

/**
 * Retrieve data about the collection file, gps or dustrak
 * @param {string} fileLink the full url to the file
 * @returns {CollectionFile} data about the collection file
 */
export const getCollectionFileByLink = async (fileLink) => {
  try {
    const response = await axios.get(fileLink);
    const file = response.data;
    if (!file) throw new Error("Failed to get file for collection");
    return { file: file, errorMessage: "" };
  } catch (error) {
    let errorMessage = "";
    if (error.response) {
      errorMessage = "Error in server response for file for collection";
    } else if (error.request) {
      errorMessage = "Error in network request for file for collection";
    } else if (error.message) {
      errorMessage = error.message;
    } else if (axios.isCancel(error)) {
      // suppress message because it is not an error
      errorMessage = "";
    } else errorMessage = "Unknown error when retrieving file for collection";
    return { file: null, errorMessage: errorMessage };
  }
};

/**
 * url is stored in database as http. To prevent mixed content errors (https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content),
 * the production protocol needs to access the link through https.
 * @param {string} link to file download
 * @returns {string} protocol set based on environment
 */
export const swapProtocol = (link) =>
  link.replace("http", process.env.REACT_APP_PROTOCOL || "http");

// TODO: Rename to highlight primary utility
// TODO: Use fallback value that can illuminate the application state
/**
 * Return the collection that was last added to a date.
 * If no collections were returned for a date, fall back to using an empty object
 * @param {Array<Collection>} pendingCollections possible collections
 * @returns {Collection || Object } Last collection or an indicator that none was found
 */
export const findActiveCollection = (pendingCollections) =>
  pendingCollections[pendingCollections.length - 1] || {
    id: ACTIVE_COLLECTION_ID_STATES.NONE_FOUND,
  };

/**
 * Handle axios throw that may have been a cancel request
 * @param {string} dataRequested type of request being made when error occurred
 * @param {Error} thrown type of error thrown
 * @return {string} the message associated with the error
 */
export const canceledRequestMessage = (dataRequested) => (thrown) =>
  axios.isCancel(thrown)
    ? `Canceled request for ${dataRequested}`
    : `Failed to get data for ${dataRequested}`;

/**
 * Overload cancel request message with collections
 */
export const canceledCollectionsMessage = canceledRequestMessage("collections");

/**
 * Overload cancel request message with collections
 */
export const canceledPollutantsMessage = canceledRequestMessage("pollutants");
