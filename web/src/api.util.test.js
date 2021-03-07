import { apiUrl, apiUrlCollections, apiUrlCollectionById } from "./api.util";

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
