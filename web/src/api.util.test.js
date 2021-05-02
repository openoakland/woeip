import { apiUrl, apiUrlCollections, apiUrlCollectionById, apiUrlDevices } from "./api.util";

it("should create the base api url with an endpoint", () => {
  expect(apiUrl("path")).toEqual("http://api.lvh.me/path");
});

it("should create the url to get all collections", () => {
  expect(apiUrlCollections()).toEqual("http://api.lvh.me/collection");
});

it("should create the url to get a collection by its ID", () => {
  expect(apiUrlCollectionById(1)).toEqual(
    "http://api.lvh.me/collection/1/data"
  );
});

// Moved this test to its own level file.
// See '.github/pull_request_template##Checklist' for instructions to run tests
// To run a specific test, instead of all of them: `run test src/[sub-path-to-file]/[file-name.test.js]`
it("should create the url to get all devices", () => {
  expect(apiUrlDevices()).toEqual("http://api.lvh.me/devices");
});
