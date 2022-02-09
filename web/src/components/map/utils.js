import axios from "axios";
import { getAccessToken } from "../auth/utils";
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
 * Meta-data for a collection
 * @typedef Collection
 * @property {number} id
 * @property {Array<string>} collection_files
 * @property {number} starts_at
 */

/**
 * Link to the Collection File
 * @typedef CollectionFile
 * @property {string} file
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
 * pollutants: {pollutant_values: Array<PollutantValue>},
 * thrownCode: number
 * }} pollutants as they are stored in the database. If the response threw, the code for its reason
 */
export const getPollutantsByCollectionId = async (
  collectionId,
  cancelTokenSource
) => {
  const options = {
    headers: {
      Authorization: `JWT ${getAccessToken()}`
    },
    cancelToken: cancelTokenSource.token,
  };
  try {
    const response = await axios.get(
      apiUrlCollectionById(collectionId),
      options
    );
    const pollutants = response?.data;
    if (!pollutants) throw new Error("Failed to get pollutants data");
    return { pollutants: pollutants, thrownCode: THROWN_CODE.NONE };
  } catch (thrown) {
    return { pollutants: {}, thrownCode: getThrownCode(thrown) };
  }
};

/**
 * Extract and parse the pollutant values, or return an empty array
 * @param {Array<PollutantValue>} pollutantValueData
 */
export const parsePollutants = (pollutantValueData) =>
  pollutantValueData?.pollutant_values?.map(parsePollutant) || [];

/**
 * Process the pollutant data to make it consumable by the client
 * @param {PollutantValue} item the shape of the pollutant as it stored in the database
 * @returns {Pollutant} the shape of the pollutant as the client wants to consume it
 */
export const parsePollutant = (item) => {
  const timeGeoSplit = item?.time_geo && item.time_geo.split("(");
  const coordsSplit = timeGeoSplit && timeGeoSplit[1].split(", ");
  return {
    timestamp: timeGeoSplit && timeGeoSplit[0].trim(),
    longitude: coordsSplit && Number(coordsSplit[0].trim()),
    latitude: coordsSplit && Number(coordsSplit[1].replace(")", "").trim()),
    name: item?.pollutant,
    value: item?.value,
  };
};

/**
 * Retrieve all of the collections that occurred on the given date
 * @param {string} formattedDate requested date, already in expected format
 * @param {CancelToken} cancelTokenSource
 * @returns {
 *  {collectionsOnDate: Array<Collection>, thrownCode: THROWN_CODE}
 * }
 */
export const getCollectionsOnDate = async (
  formattedDate,
  cancelTokenSource
) => {
  const options = {
    headers: {
      Authorization: `JWT ${getAccessToken()}`
    },
    params: {
      start_date: formattedDate,
    },
    cancelToken: cancelTokenSource.token,
  };
  try {
    const response = await axios.get(apiUrlCollections(), options);
    const collectionsOnDate = response.data;
    if (!collectionsOnDate)
      throw new Error("Failed to retrieve collection data for day");
    if (!Array.isArray(collectionsOnDate))
      throw new Error(
        "Retrieved collection data for day failed to conform to array structure"
      );
    return {
      collectionsOnDate: collectionsOnDate,
      thrownCode: THROWN_CODE.NONE,
    };
  } catch (thrown) {
    return { collectionsOnDate: [], thrownCode: getThrownCode(thrown) };
  }
};

/**
 * Retrieve data about the collection file, gps or dustrak
 * @param {string} fileLink the url to the file
 * @param {CancelToken} cancelTokenSource
 * @returns {{ file: CollectionFile || null, thrownCode: THROWN_CODE}} data about the collection file
 */
export const getCollectionFileByLink = async (fileLink, cancelTokenSource) => {
  const options = {
    headers: {
      Authorization: `JWT ${getAccessToken()}`
    },
    cancelToken: cancelTokenSource.token,
  };
  try {
    const file = (await axios.get(fileLink, options)).data;
    if (!file) throw new Error("Failed to retrieve file data");
    return { file: file, thrownCode: THROWN_CODE.NONE };
  } catch (thrown) {
    return { file: null, thrownCode: getThrownCode(thrown) };
  }
};

/**
 * Return a code for axios catch block depending on whether the request failed because it was canceled
 * @param {Error} thrown error sent to a catch block after
 * @returns {THROWN_CODE} the number associated with a type of failure
 */
export const getThrownCode = (thrown) =>
  axios.isCancel(thrown) ? THROWN_CODE.CANCELED : THROWN_CODE.FAILED;

/**
 * Return the collection that was last added to a date.
 * If no collections were returned for a date, fall back to using an empty object
 * @param {Array<Collection>} collections possible collections
 * @returns { Collection } Latest collection or an empty object
 */
export const getFirstCollection = (collections) =>
  (collections && collections[collections.length - 1]) ||
  BLANK_ACTIVE_COLLECTION;
