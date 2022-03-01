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
 * Shape of pollutants in geojson format
 * @typedef SpatialPollutants
 * @property {string} type
 * @property {Array<{
 *  type: string,
 *  properties: {
 *    reading: number,
 *  }
 *  geometry: {
 *    type: string,
 *    coordinates: Array<number>
 *  }
 * }>} features
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

export const EMPTY_POLLUTANTS = {
  type: "FeatureCollection",
  features: [],
};

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
 * Create a geojson object for pollutants
 * @param {Array<Pollutant>} pollutants
 * @returns {SpatialPollutants}
 */
export const spatializePollutants = (pollutants) => {
  return {
    type: "FeatureCollection",
    features: pollutants.map((pollutant) => {
      return {
        type: "Feature",
        properties: { value: pollutant.value },
        geometry: {
          type: "Point",
          coordinates: [pollutant.longitude, pollutant.latitude],
        },
      };
    }),
  };
};

/** For all readings taken at the same location,
 * keep the highest value and discard the rest.
 * @param {Array<Pollutant>}
 * @returns {Array<Pollutant>}
 */
export const mergePollutants = (pollutants) => {
  const seenPollutants = {};
  pollutants.forEach((pollutant) => {
    const locationKey = `${pollutant.latitude},${pollutant.longitude}`;
    const higherPollutant = comparePollutantValues(
      seenPollutants[locationKey],
      pollutant
    );
    seenPollutants[locationKey] = higherPollutant;
  });
  return Object.values(seenPollutants);
};

/**
 * Find the highest of two pollutant values, with the previous value possibly undefined
 * @param {Pollutant | undefined} seenPollutant
 * @param {Pollutant} currentPollutant
 * @returns {Pollutant}
 */
export const comparePollutantValues = (seenPollutant, currentPollutant) => {
  if (!seenPollutant) return currentPollutant;
  const maxValue = Math.max(seenPollutant.value, currentPollutant.value);
  return maxValue === currentPollutant.value ? currentPollutant : seenPollutant;
};

/**
 * Extract and parse the pollutant values, or return an empty array
 * @param {Array<PollutantValue>} pollutantValueData
 * @returns {Array<Pollutant>}
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
 * Generic api call to get metadata about collections
 * @param {CancelToken} cancelTokenSource
 * @param {object} params parameters to pass to api
 * @returns {
 *   {collections: Array<Collection>, thrownCode: THROWN_CODE}
 * }
 */
export const getCollections = async (params, cancelTokenSource) => {
  const options = { params, cancelTokenSource };
  try {
    const response = await axios.get(apiUrlCollections(), options);
    const collections = response.data;
    if (!collections)
      throw new Error(`Failed to retrieve collection data matching parameters ${params}`);
    if (!Array.isArray(collections))
      throw new Error(
        `Retrieved collection data failed to conform to array structure. Parameters given: ${params}`
      );
    return {
      collections,
      thrownCode: THROWN_CODE.NONE,
    };
  } catch (thrown) {
    return { collections: [], thrownCode: getThrownCode(thrown) };
  }
};

/**
 * Retrieve all of the collections that occurred on the given date. Wrapper for getCollections
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
  const {
    collections: collectionsOnDate,
    thrownCode
  } = await getCollections({ start_date: formattedDate }, cancelTokenSource);
  return { collectionsOnDate, thrownCode };
};
/**
 * Retrieve data about the collection file, gps or dustrak
 * @param {string} fileLink the url to the file
 * @param {CancelToken} cancelTokenSource
 * @returns {{ file: CollectionFile || null, thrownCode: THROWN_CODE}} data about the collection file
 */
export const getCollectionFileByLink = async (fileLink, cancelTokenSource) => {
  const options = {
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
