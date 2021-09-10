export const FILE_STATES = {
  GPS_FILE_URL: {
    PENDING_RESPONSE: "state/gpsFileUrl/pendingResponse",
    NONE_FOUND: "state/gpsFileUrl/noneFound",
    REQUEST_FAILED: "state/gpsFileUlr/requestFailed",
  },
  DUSTRAK_FILE_URL: {
    PENDING_RESPONSE: "state/dustrakFileUrl/pendingResponse",
    NONE_FOUND: "state/dustrakFileUrl/noneFound",
    REQUEST_FAILED: "state/dustrakFileUlr/requestFailed",
  },
};

export const FILE_MESSAGES = {
  [FILE_STATES.GPS_FILE_URL.PENDING_RESPONSE]:
    "Pending valid gps file from database",
  [FILE_STATES.GPS_FILE_URL.NONE_FOUND]:
    "No gps file found for this collection",
  [FILE_STATES.GPS_FILE_URL.REQUEST_FAILED]: "Failed to retrieve gps file",

  [FILE_STATES.DUSTRAK_FILE_URL.PENDING_RESPONSE]:
    "Pending valid dustrak file from database",
  [FILE_STATES.DUSTRAK_FILE_URL.NONE_FOUND]:
    "No dustrak file found for this collection",
  [FILE_STATES.DUSTRAK_FILE_URL.REQUEST_FAILED]:
    "Failed to retrieve dustrak file",
};

export const ACTIVE_COLLECTION_ID_STATES = {
  PENDING_RESPONSE: -1,
  NONE_FOUND: -2,
  REQUEST_FAILED: -3,
};

export const ACTIVE_COLLECTION_ID_MESSAGES = {
  [ACTIVE_COLLECTION_ID_STATES.PENDING_RESPONSE]:
    "Pending valid collection from database",
  [ACTIVE_COLLECTION_ID_STATES.NONE_FOUND]:
    "We haven't collected data for this time period. Please select another date.",
  [ACTIVE_COLLECTION_ID_STATES.REQUEST_FAILED]:
    "Failed to retrieve collection for this day",
};
