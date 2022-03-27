import fs from "fs";
import moment from "moment-timezone";
import {
  findDevice,
  getFilesForm,
  messageForFileCount,
  messageForInvalidTime,
  messageForMismatchedTimes,
  messageForMissingFileType,
  identFiles,
  getDustrakSerial,
  getGpsStart,
  getDustrakStart,
  getDustrakEnd,
  extractFileMetaContent,
} from "./utils";

//TODO: use mock service worker to test
describe.skip("getDevices", () => {
  it.todo("successfully fetch devices");
  it.todo("failed to fetch devices");
});

//TODO: as part of auth changes
describe("getCollectionErrorMessage", () => {
  it.todo("should get auth error");
  it.todo("should get duplicate error");
});

//TODO: as part of auth changes
describe("saveCollection", () => {
  it.todo("should successfully upload data");
  it.todo("should handle failed upload");
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
    },
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

describe("getFilesForm", () => {
  it("should construct a valid files form", () => {
    const firstFile = new File(["hello"], "hello.csv", { type: "text/csv" });
    const secondFile = new File(["goodbye"], "goodbye.log", {
      type: "text/log",
    });

    const dustrakStart = moment();
    const dustrakEnd = moment();
    const filesForm = getFilesForm({
      firstFile,
      secondFile,
      dustrakStart,
      dustrakEnd,
    });
    expect(filesForm.getAll("upload_files")).toHaveLength(2);
    expect(filesForm.get("starts_at")).toEqual(dustrakStart.format());
    expect(filesForm.get("ends_at")).toEqual(dustrakEnd.format());
    expect(filesForm.get("pollutant")).toEqual("1");
  });
});

describe("Message for File Count", () => {
  it("should return an empty error when count is zero or two", () => {
    expect(messageForFileCount(2)).toBeFalsy();
    expect(messageForFileCount(0)).toBeFalsy();
  });

  it("should advise adding a file when too few are added", () => {
    expect(messageForFileCount(1)).toMatch("add a file to continue");
  });

  it("should advise remove file(s) when too many are added", () => {
    expect(messageForFileCount(3)).toMatch("remove additional files");
  });
});

describe("messageForInvalidTime", () => {
  let validTime;
  let invalidTime;
  beforeAll(() => {
    validTime = moment();
    invalidTime = moment("");
  });

  afterAll(() => {
    validTime = null;
    invalidTime = null;
  });

  it("should confirm times are valid and invalid", () => {
    expect(validTime.isValid()).toBe(true);
    expect(invalidTime.isValid()).toBe(false);
  });

  it("should return an error message if any time is invalid", () => {
    expect(messageForInvalidTime(invalidTime, validTime, validTime)).toMatch(
      "Files could not be uploaded"
    );
    expect(messageForInvalidTime(validTime, invalidTime, validTime)).toMatch(
      "Files could not be uploaded"
    );
    expect(messageForInvalidTime(validTime, validTime, invalidTime)).toMatch(
      "Files could not be uploaded"
    );
    expect(
      messageForInvalidTime(invalidTime, invalidTime, invalidTime)
    ).toMatch("Files could not be uploaded");
  });

  it("should return an empty string if all times are valid", () => {
    expect(messageForInvalidTime(validTime, validTime, validTime)).toBeFalsy();
  });
});

describe("Message for Missing File Type", () => {
  it("should not return an error message if both files are defined", () => {
    expect(
      messageForMissingFileType([{ name: "gps.log" }, { name: "dustrak.csv" }])
    ).toBeFalsy();
  });

  it("should return an error message if at least one file is undefined", () => {
    expect(
      messageForMissingFileType([undefined, { name: "dustrak.csv" }])
    ).toMatch("replace one of your files");
  });
});

describe("Identify GPS and Dustrak File", () => {
  it("should have two undefined files", () => {
    const [gpsFile, dustrakFile] = identFiles([
      { name: "empty.txt" },
      { name: "empty.txt" },
    ]);
    expect(gpsFile).toBeUndefined();
    expect(dustrakFile).toBeUndefined();
  });

  it("should have GPS defined and Dustrak Undefined", () => {
    const [gpsFile, dustrakFile] = identFiles([
      { name: "gps.log" },
      { name: "empty.txt" },
    ]);
    expect(gpsFile).toBeDefined();
    expect(dustrakFile).toBeUndefined();
  });

  it("should have GPS undefined Dustrak defined", () => {
    const [gpsFile, dustrakFile] = identFiles([
      { name: "empty.txt" },
      { name: "dustrak.csv" },
    ]);
    expect(gpsFile).toBeUndefined();
    expect(dustrakFile).toBeDefined();
  });

  it("should have GPS and Dustrak defined", () => {
    const [gpsFile, dustrakFile] = identFiles([
      { name: "gps.log" },
      { name: "dustrak.csv" },
    ]);
    expect(gpsFile).toBeDefined();
    expect(dustrakFile).toBeDefined();
  });
});

describe("messageForMismatchedTimes", () => {
  let dustrakStart;
  beforeAll(() => {
    dustrakStart = moment();
  });

  afterAll(() => {
    dustrakStart = null;
  });

  it("should error when gps time is too high and dates match", () => {
    const gpsStart = dustrakStart.clone().add(3, "minutes");
    expect(messageForMismatchedTimes(dustrakStart, gpsStart)).toMatch(
      "Times don't match"
    );
  });

  it("should error when gps time is too low and dates match", () => {
    const gpsStart = dustrakStart.clone().subtract(3, "minutes");
    expect(messageForMismatchedTimes(dustrakStart, gpsStart)).toMatch(
      "Times don't match"
    );
  });

  it("should error when gps date doesn't match", () => {
    const gpsStart = dustrakStart.clone().subtract(3, "days");
    expect(messageForMismatchedTimes(dustrakStart, gpsStart)).toMatch(
      "Dates don't match"
    );
  });

  it("should not error when gps time in range", () => {
    const gpsStart = dustrakStart.clone().subtract(1, "minutes");
    expect(messageForMismatchedTimes(dustrakStart, gpsStart)).toBeFalsy();

    gpsStart.add(2, "minutes");
    expect(messageForMismatchedTimes(dustrakStart, gpsStart)).toBeFalsy();
  });
});

// TODO: Refactor to just standard arrays?
const testDir = `${__dirname}/test-data`;
describe("process gps and dustrak files", () => {
  let validGps;
  let gprmcMissing;
  let gprmcCorrupt;
  let validDustrak;
  let wrongDustrak;
  let missingStartDustrak;
  let empty;

  /**
   * It is time-intensive to extract files.
   * Run the process exactly once and make the data available to the whole test block
   * Any test suites that rely on file data are placed in this test block
   */
  beforeAll(async () => {
    const readFile = (path, opts = "utf8") =>
      new Promise((resolve, reject) => {
        fs.readFile(path, opts, (err, data) => {
          if (err) reject(`error: ${err}`);
          else resolve(data.toString().split("\n", 10));
        });
      });

    const fileNames = [
      "valid.log",
      "gprmc_missing.log",
      "gprmc_corrupt.log",
      "valid.csv",
      "wrong.csv",
      "start_missing.csv",
      "empty.txt",
    ];
    const filePromises = [];
    for (const file of fileNames) {
      const filePomise = readFile(`${testDir}/${file}`);
      filePromises.push(filePomise);
    }

    [
      validGps,
      gprmcMissing,
      gprmcCorrupt,
      validDustrak,
      wrongDustrak,
      missingStartDustrak,
      empty,
    ] = await Promise.all(filePromises);
  });

  afterAll(() => {
    validGps = null;
    gprmcMissing = null;
    gprmcCorrupt = null;
    validDustrak = null;
    wrongDustrak = null;
    missingStartDustrak = null;
    empty = null;
  });

  describe("getDustrakSerial", () => {
    it("should find a valid dustrak serial", () => {
      expect(getDustrakSerial(validDustrak)).toEqual("8530094612");
    });

    it("should handle a corrupted dustrak file with blank serial", () => {
      expect(getDustrakSerial(empty)).toEqual("");
    });

    it("should handle a dustrak file missing its start", () => {
      const corruptSerial = ["", "", ""];
      expect(getDustrakSerial(corruptSerial)).toEqual("");
    });
  });

  describe("getGpsStart", () => {
    it("should find the time listed in the GPS", () => {
      expect(getGpsStart(validGps).isValid()).toBe(true);
    });

    it("has an error from not finding a start datetime", () => {
      expect(getGpsStart(gprmcMissing).isValid()).toBe(false);
    });

    it("should fail to create a valid moment in gps", () => {
      expect(getGpsStart(gprmcCorrupt).isValid()).toBe(false);
    });

    it("should handle empty in gps module", () => {
      expect(getGpsStart(empty).isValid()).toBe(false);
    });
  });

  describe("getDustrakStart", () => {
    it("finds the start and end dustrak datetimes", () => {
      const startDatetime = getDustrakStart(validDustrak);
      expect(startDatetime.isValid()).toBe(true);
      expect(getDustrakEnd(validDustrak, startDatetime).isValid()).toBe(true);
    });

    it("moment handles non-datetime data", () => {
      const startDatetime = getDustrakStart(wrongDustrak);
      expect(startDatetime.isValid()).toBe(false);
      expect(getDustrakEnd(wrongDustrak, startDatetime).isValid()).toBe(false);
    });

    it("cant find start and end", () => {
      const startDatetime = getDustrakStart(missingStartDustrak);
      expect(startDatetime.isValid()).toBe(false);
      expect(getDustrakEnd(missingStartDustrak, startDatetime).isValid()).toBe(
        false
      );
    });

    it("should handle empty in dustrak modules", () => {
      const startDatetime = getDustrakStart(empty);
      expect(startDatetime.isValid()).toBe(false);
      expect(getDustrakEnd(empty, startDatetime).isValid()).toBe(false);
    });
  });

  describe("extractFileMetaContent", () => {
    it("should parse a file with newline characters", async () => {
      const mockFileBlob = { text: async () => "Line One\nLine Two" };
      const textLines = await extractFileMetaContent(mockFileBlob);
      expect(textLines).toHaveLength(2);
      expect(textLines[0]).toMatch("Line One");
      expect(textLines[1]).toMatch("Line Two");
    });

    it("should resolve to incorrect times", async () => {
      const mockFileBlob = { text: async () => "" };
      const textLines = await extractFileMetaContent(mockFileBlob);
      expect(textLines).toHaveLength(1);
      expect(textLines[0]).toBeFalsy();
    });

    it("should trigger an error", async () => {
      const mockConsoleError = jest
        .spyOn(console, "error")
        .mockImplementation();
      const mockFileBlob = {
        text: async () => {
          throw new Error();
        },
      };
      const textLines = await extractFileMetaContent(mockFileBlob);
      expect(textLines).toHaveLength(1);
      expect(textLines[0]).toBeFalsy();
      expect(mockConsoleError).toBeCalledWith(
        "error getting data from the file"
      );
      mockConsoleError.mockRestore();
    });
  });
});
