import axios from "axios";

import { apiUrlCollectionById, apiUrlCollections } from "../../api.util";

/**
 * Geo-Coordinates
 * @typedef Coordinates
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 * Pollutant data
 * @typedef Pollutant
 * @property {string} name
 * @property {string} timestamp
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} value
 */

/**
 * Shape of pollutant data stored in database
 * @typedef PollutantValue
 * @property {number} value
 * @property {string} time_geo
 * @property {string} pollutant
 */

/**
 * @param {PollutantValue} item
 * @returns {Pollutant}
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
 *
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
 * Retrieve data about the file
 * @param {string} fileLink the full url to the file
 * @returns {CollectionFile}
 */
export const getCollectionFileByLink = async (fileLink) => {
  return (await axios.get(fileLink)).data;
};

export const getPollutantsByCollectionId = async (
  collectionId,
  cancelTokenSource
) => {
  if (!collectionId) return [];
  const options = {
    cancelToken: cancelTokenSource.token,
  };
  const response = await axios.get(apiUrlCollectionById(collectionId), options);
  return response.data.pollutant_values.map(parsePollutant);
};

/**
 * If no collections were returned for a date, fall back to using an empty object
 * @param {Array<Collection>} pendingCollection
 * @returns {Collection || Object }
 */
export const fallbackCollection = (pendingCollections) =>
  pendingCollections[pendingCollections.length - 1] || {};
