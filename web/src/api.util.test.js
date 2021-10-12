import {
  apiUrl,
  apiUrlCollections,
  apiUrlCollectionById,
  apiUrlDevices,
} from "./api.util";

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

it("should create the url to get all devices", () => {
  expect(apiUrlDevices()).toEqual("http://api.lvh.me/devices");
});
