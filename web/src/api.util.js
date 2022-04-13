/**
 * Base function to construct requests to the api
 * All Available API endpoints are available on
 * the development server at api.lvh.me/swagger/
 * @param {string} endpoint the path for the api
 * @returns {string} url for  the api
 */
export const apiUrl = (endpoint) => {
  const domain = process.env.REACT_APP_API_DOMAIN || "api.lvh.me";
  return `//${domain}/${endpoint}`;
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

/**
 * Constructs the api endpoint to login
 * @returns {string}
 */
export const apiUrlAuthLogin = () => apiUrl("auth/login/");

/**
 * Constructs the api endpoint to logout
 * @returns {string}
 */
export const apiUrlAuthLogout = () => apiUrl("auth/logout/");

/**
 * Constructs the api endpoint to register a user
 * @returns {string}
 */
export const apiUrlAuthRegister = () => apiUrl("auth/register/");

/**
 * Removes the protocol from a url so that it is an empty protocol.
 * This prevents mixed content errors (https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content),
 * when one environment is http and the other is https
 * @param {string} link
 * @returns {string} the link in the form "//domain.io"
 */
export const emptyProtocol = (link) => link.replace(/^(https?|ftp):/, "");

/**
 * Passing the auth token to the server in the header requires preceding it with "Token"
 * @param {string} authToken
 * @returns {string} token formatted for use in headers
 */
export const authTokenHeaderFormat = (authToken) => `Token ${authToken}`;
