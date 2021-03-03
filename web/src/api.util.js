export const apiUrl = (endpoint) => {
  const protocol = process.env.REACT_APP_PROTOCOL;
  const domain = process.env.REACT_APP_API_DOMAIN;
  return `${protocol}://${domain}/${endpoint}`;
};

export const apiUrlCollections = () => apiUrl("collection");

export const apiUrlCollectionById = (collectionId) =>
  apiUrl(`collection/${collectionId}/data`);
