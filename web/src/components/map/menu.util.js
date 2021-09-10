import {
  ACTIVE_COLLECTION_ID_MESSAGES,
  ACTIVE_COLLECTION_ID_STATES,
} from "./constants";

export const sessionIdDisplay = (activeCollectionId) => {
  if (!ACTIVE_COLLECTION_ID_MESSAGES[activeCollectionId])
    return activeCollectionId + "";
  if (activeCollectionId === ACTIVE_COLLECTION_ID_STATES.NONE_FOUND)
    return "None";
  if (activeCollectionId === ACTIVE_COLLECTION_ID_STATES.PENDING_RESPONSE)
    return ACTIVE_COLLECTION_ID_MESSAGES[activeCollectionId];
  return "";
};
