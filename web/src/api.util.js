/**
 * Base function to construct requests to the api
 * All Available API endpoints are available on
 * the development server at api.lvh.me/swagger/
 * @param {string} endpoint the path for the api
 * @returns {string} url for  the api
 */
export const apiUrl = (endpoint) => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_DOMAIN
      : `http://api.lvh.me`;
  // const protocol = process.env.REACT_APP_PROTOCOL || "http";
  // const domain = process.env.REACT_APP_API_DOMAIN || "api.lvh.me";
  // return `${protocol}://${domain}/${endpoint}`;
  return `${baseUrl}/${endpoint}`;
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
 * Constructs the api endpoint that takes a set of user credentials and returns an access and refresh JSON web token pair to prove the authentication of those credentials.
 * @returns {string}
 */
export const apiUrlCreateJWTToken = () => apiUrl("auth/jwt/create");

/**
 * Constructs the api endpoint that registers a user
 * @returns {string}
 */
export const apiUrlRegister = () => apiUrl("auth/users/");

/**
 * Constructs the api endpoint that loads a user
 * @returns {string}
 */
export const apiUrlLoadUser = () => apiUrl("auth/users/me");

/**
 * Constructs the api endpoint that verifies token
 * @returns {string}
 */
export const apiUrlVerifyToken = () => apiUrl("auth/jwt/verify");

/**
 * Constructs the api endpoint that verifies user activation
 * @returns {string}
 */
export const apiUrlVerifyActivation = () => apiUrl("auth/users/activation/");

/** Removes the protocol from a url so that it is an empty protocol.
 * This prevents mixed content errors (https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content),
 * when one environment is http and the other is https
 * @param {string} link
 * @returns {string} the link in the form "//domain.io"
 */
export const emptyProtocol = (link) => link.replace(/^(https?|ftp):/, "");
