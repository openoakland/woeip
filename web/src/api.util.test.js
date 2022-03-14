import {
  apiUrl,
  apiUrlCollections,
  apiUrlCollectionById,
  apiUrlDevices,
  authTokenHeaderFormat,
  emptyProtocol,
  isRequestSuccessful,
} from "./api.util";

it("should create the base api url with an endpoint", () => {
  expect(apiUrl("path")).toEqual("//api.lvh.me/path");
});

it("should create the url to get all collections", () => {
  expect(apiUrlCollections()).toEqual("//api.lvh.me/collection");
});

it("should create the url to get a collection by its ID", () => {
  expect(apiUrlCollectionById(1)).toEqual("//api.lvh.me/collection/1/data");
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

describe("authTokenHeaderFormat", () => {
  it('should pair the token itself with the work "Token"', () =>
    expect(authTokenHeaderFormat("tokenItself")).toBe("Token tokenItself"));
});

describe("isRequestSuccessful", () => {
  it("should be successful on 200", () =>
    expect(isRequestSuccessful(200)).toBe(true));
  it("should be successful on 201", () =>
    expect(isRequestSuccessful(201)).toBe(true));
  it("should be a failure on 400", () =>
    expect(isRequestSuccessful(400)).toBe(false));
});
