import axios from "axios";

export const apiUrl = (endpoint) => {
  const protocol = process.env.REACT_APP_PROTOCOL;
  const domain = process.env.REACT_APP_API_DOMAIN;
  return `${protocol}://${domain}/${endpoint}`;
};

export const apiUrlCollections = () => apiUrl("collection");

export const apiUrlCollectionById = (collectionId) =>
  apiUrl(`collection/${collectionId}/data`);

/**
 * Standard handling of a cancel thrown
 * @param {string} dataRequest
 */
export const canceledRequestMessage = (dataRequested) => (
  thrown,
  setNoLongerLoading
) => {
  if (axios.isCancel(thrown)) {
    console.log(`Canceled request for ${dataRequested}`);
  } else {
    console.error(`Failed to get data for ${dataRequested}`);
    setNoLongerLoading();
  }
};

export const canceledCollectionsMessage = canceledRequestMessage("collections");
export const canceledPollutantsMessage = canceledRequestMessage("pollutants");
