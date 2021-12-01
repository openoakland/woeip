import { findDevice } from "./utils";
//TODO: install 'fetch-mock' (https://www.npmjs.com/package/fetch-mock?activeTab=readme)
// for until testing api requests

describe.skip("getDevices", () => {
  it.todo("successfully fetch devices");
  it.todo("failed to fetch devices");
});

describe("findDevice", () => {
  const devices = [
    {
      name: "A",
      serial: "1234",
    },
    {
      name: "B",
      serial: "5678",
    },
    {
      name: "C",
      serial: "9012",
    }
  ];

  it("should find the device with the serial of interest", () => {
    expect(findDevice(devices, "5678")).toEqual(
      expect.objectContaining({ name: "B" })
    );
  });
  it("should fail to find a device with a serial", () => {
    expect(findDevice(devices, "abcd")).toEqual({});
  });
  it("should fail to find a device with no serial", () => {
    expect(findDevice(devices)).toEqual({});
  });
});
