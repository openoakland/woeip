/**
 * Base function to construct requests to the api
 * All Available API endpoints are available on
 * the development server at api.lvh.me/swagger/
 * @param {string} endpoint the path for the api
 * @returns {string} url for  the api
 */
export const apiUrl = (endpoint) => {
  const protocol = process.env.REACT_APP_PROTOCOL || "http";
  const domain = process.env.REACT_APP_API_DOMAIN || "api.lvh.me";
  return `${protocol}://${domain}/${endpoint}`;
};

/**
 * Constructs the api endpoint for all collections
 * @returns {string}
 */
export const apiUrlCollections = () => apiUrl("collection");

/**
 * Constructs the api endpoint for retrieving a collection by its id
 * @param {string} collectionId the database ID for a collection
 * @returns
 */
export const apiUrlCollectionById = (collectionId) =>
  apiUrl(`collection/${collectionId}/data`);

/**
 * Constructs the api endpoint for all devices
 * @returns {string}
 */
 export const apiUrlDevices = () => apiUrl("devices");
