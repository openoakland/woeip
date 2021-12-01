import {
  apiUrl,
  apiUrlCollections,
  apiUrlCollectionById,
  apiUrlDevices,
  emptyProtocol,
  apiUrlCreateJWTToken,
  apiUrlRegister,
  apiUrlLoadUser,
  apiUrlVerifyToken,
  apiUrlVerifyActivation,
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

it("should create the url to create jwt token", () => {
  expect(apiUrlCreateJWTToken()).toEqual("http://api.lvh.me/auth/jwt/create");
});

it("should create the url to register user", () => {
  expect(apiUrlRegister()).toEqual("http://api.lvh.me/auth/users");
});

it("should create the url to load user", () => {
  expect(apiUrlLoadUser()).toEqual("http://api.lvh.me/auth/users/me");
});

it("should create the url to verify token", () => {
  expect(apiUrlVerifyToken()).toEqual("http://api.lvh.me/auth/jwt/verify");
});

it("should create the url to verify activation", () => {
  expect(apiUrlVerifyActivation()).toEqual("http://api.lvh.me/auth/users/activation");
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
