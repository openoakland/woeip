import axios from "axios";

import { apiUrlCollectionById, apiUrlCollections } from "../../api.util";

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

export const BLANK_ACTIVE_ID = -1;
export const BLANK_ACTIVE_STARTS_AT = "";
export const BLANK_ACTIVE_COLLECTION = {
  id: BLANK_ACTIVE_ID,
  collection_files: ["", ""],
  starts_at: BLANK_ACTIVE_STARTS_AT,
};

export const THROWN_CODE = {
  NONE: 0,
  FAILED: 1,
  CANCELED: 2,
};

/**
 * Retrieve the pollutants that were detected by a given collection session
 * @param {string} collectionId the integer-like database id of the collection
 * @param {axios.CancelToken} cancelTokenSource an axios token to cancel the request
 * @returns {{
 * pollutants: Array<PollutantValue>,
 * thrownCode: number
 * }} pollutants as they are stored in the database. If the response threw, the code for its reason
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
    const pollutants = response?.data;
    if (!pollutants) throw new Error("Failed to get pollutants data");
    if (!Array.isArray(pollutants))
      throw new Error("Response data for pollutants is not an array");
    return { pollutants: pollutants, thrownCode: THROWN_CODE.NONE };
  } catch (thrown) {
    const thrownCode = axios.isCancel(thrown)
      ? THROWN_CODE.CANCELED
      : THROWN_CODE.FAILED;
    return { pollutants: [], thrownCode: thrownCode };
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
 * Retrieve all of the collections that occured on the given date
 * @param {moment} mapDate
 * @param {CancelToken} cancelTokenSource
 * @returns {Array<Collection>}
 */
export const getCollectionsOnDate = async (mapDate, cancelTokenSource) => {
  const options = {
    params: {
      start_date: mapDate,
    },
    cancelToken: cancelTokenSource.token,
  };
  return (await axios.get(apiUrlCollections(), options)).data;
};

/**
 * Retrieve data about the collection file, gps or dustrak
 * @param {string} fileLink the full url to the file
 * @returns {CollectionFile} data about the collection file
 */
export const getCollectionFileByLink = async (fileLink, cancelTokenSource) => {
  const options = {
    cancelToken: cancelTokenSource.token,
  };
  return (await axios.get(fileLink, options)).data;
};

/**
 * url is stored in database as http. To prevent mixed content errors (https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content),
 * the production protocol needs to access the link through https.
 * use empty protocol to match application protocol
 * @param {string} link to file download
 * @returns {string} protocol set based on environment
 */
export const swapProtocol = (link) => link.replace(/^(https?|ftp):\/\//, "//");

/**
 * Return the collection that was last added to a date.
 * If no collections were returned for a date, fall back to using an empty object
 * @param {Array<Collection>} pendingCollections possible collections
 * @returns {Collection || Object } Lastest collection or an empty object
 */
export const getFirstCollection = (pendingCollections) =>
  pendingCollections[pendingCollections.length - 1] || BLANK_ACTIVE_COLLECTION;

/**
 * Handle axios throw that may have been a cancel request
 * @param {string} dataRequested type of request being made when error occurred
 * @param {Error} thrown type of error thrown
 */
export const canceledRequestMessage = (dataRequested) => (thrown) => {
  if (axios.isCancel(thrown)) {
    console.log(`Canceled request for ${dataRequested}`);
  } else {
    console.error(`Failed to get data for ${dataRequested}`);
  }
};

/**
 * Overload cancel request message with collections
 */
export const canceledCollectionsMessage = canceledRequestMessage("collections");

/**
 * Overload cancel request message with collections
 */
export const canceledPollutantsMessage = canceledRequestMessage("pollutants");
