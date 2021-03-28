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
  if (!collectionId) return [];
  return (await axios.get(apiUrlCollectionById(collectionId), options)).data;
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
      start_date: mapDate.format("YYYY-MM-DD"),
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
export const getCollectionFileByLink = async (fileLink) => {
  if (!fileLink) return "";
  return (await axios.get(fileLink)).data;
};

/**
 * Return the collection that was last added to a date.
 * If no collections were returned for a date, fall back to using an empty object
 * @param {Array<Collection>} pendingCollections possible collections
 * @returns {Collection || Object } Lastest collection or an empty object
 */
export const fallbackCollection = (pendingCollections) =>
  pendingCollections[pendingCollections.length - 1] || {};

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
