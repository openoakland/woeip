import {
  apiUrl,
  apiUrlCollections,
  apiUrlCollectionById,
  apiUrlDevices,
  emptyProtocol,
} from "./api.util";

it("should create the base api url with an endpoint", () => {
  expect(apiUrl("path")).toEqual("//api.lvh.me/path");
});

it("should create the url to get all collections", () => {
  expect(apiUrlCollections()).toEqual("//api.lvh.me/collection");
});

it("should create the url to get a collection by its ID", () => {
  expect(apiUrlCollectionById(1)).toEqual(
    "//api.lvh.me/collection/1/data"
  );
});

it("should create the url to get all devices", () => {
  expect(apiUrlDevices()).toEqual("//api.lvh.me/devices");
});

describe("empty protocol", () => {
  const emptyProtocolLink = "//example.com";
  it("should remove http", () =>
    expect(emptyProtocol(`http:${emptyProtocolLink}`)).toEqual(
      emptyProtocolLink
    ));

  it("should remove https", () =>
    expect(emptyProtocol(`https:${emptyProtocolLink}`)).toEqual(
      emptyProtocolLink
    ));

  it("should remove ftp", () =>
    expect(emptyProtocol(`ftp:${emptyProtocolLink}`)).toEqual(
      emptyProtocolLink
    ));
});
