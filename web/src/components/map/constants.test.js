import {
  FILE_STATES,
  ACTIVE_COLLECTION_ID_STATES,
  FILE_MESSAGES,
  ACTIVE_COLLECTION_ID_MESSAGES,
} from "./constants";

describe("displays message based on state", () => {
  it("should return a file state from a raw map lookup", () => {
    expect(FILE_STATES.GPS_FILE_URL.PENDING_RESPONSE).toEqual(
      "state/gpsFileUrl/pendingResponse"
    );
  });

  it("should return an active collection id state from a raw map lookup", () => {
    expect(ACTIVE_COLLECTION_ID_STATES.PENDING_RESPONSE).toEqual(-1);
  });

  it("should return a file message based on a raw state", () => {
    expect(FILE_MESSAGES["state/gpsFileUrl/pendingResponse"]).toEqual(
      "Pending valid gps file from database"
    );
  });

  it("should return an active collection id message based on a raw state", () => {
    expect(ACTIVE_COLLECTION_ID_MESSAGES[-1]).toEqual(
      "Pending valid collection from database"
    );
  });

  it("should return falsy when looking up unmapped file value", () => {
    expect(FILE_MESSAGES["https://example.com"]).toBeFalsy();
  });

  it("should return falsy when looking up unmapped active collection id value", () => {
    expect(ACTIVE_COLLECTION_ID_MESSAGES["https://example.com"]).toBeFalsy();
  });
});
