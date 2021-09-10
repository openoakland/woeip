import {
  ACTIVE_COLLECTION_ID_MESSAGES,
  ACTIVE_COLLECTION_ID_STATES,
} from "./constants";
import { sessionIdDisplay } from "./menu.util";

describe("display the id for active collection", () => {
  it("should return collection id as string when valid", () => {
    expect(sessionIdDisplay(0)).toEqual("0");
  });
  it("should return undefined as string when undefined", () => {
    expect(sessionIdDisplay(undefined)).toEqual("undefined");
  });
  it("should return None when none found", () => {
    expect(sessionIdDisplay(ACTIVE_COLLECTION_ID_STATES.NONE_FOUND)).toEqual(
      "None"
    );
  });
  it("should return Pending Message when pending", () => {
    expect(
      sessionIdDisplay(ACTIVE_COLLECTION_ID_STATES.PENDING_RESPONSE)
    ).toEqual(
      ACTIVE_COLLECTION_ID_MESSAGES[
        ACTIVE_COLLECTION_ID_STATES.PENDING_RESPONSE
      ]
    );
  });
  it("should return nothing when there is an error", () => {
    expect(
      sessionIdDisplay(ACTIVE_COLLECTION_ID_STATES.REQUEST_FAILED)
    ).toEqual("");
  });
});
