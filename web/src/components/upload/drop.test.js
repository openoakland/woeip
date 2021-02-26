import { screen, render } from "@testing-library/react";
import fs from "fs";
import { UploadDrop } from "./drop";

describe("Upload Drop", () => {
  it("should have a drop zone and no pending files", () => {
    renderUploadDrop();
    expect(screen.getByText(/DusTrak and GPS files/i)).toBeInTheDocument();
    expect(screen.queryByText(/Pending Files/)).not.toBeInTheDocument();
  });

  it("should have an error message for one file, and other trimmings for pending files", () => {
    const files = [new File(["hello"], "hello.csv", { type: "text/csv" })];
    renderUploadDrop({ files });
    // Error message
    expect(screen.getByText(/add a file/)).toBeInTheDocument();

    // Other trimmings
    // Files are pending
    expect(screen.getByText(/Pending Files/)).toBeInTheDocument();
    // Remove button is a trash icon
    expect(screen.getByRole("button").childNodes[0].className).toMatch("trash");
  });

  it("should have an error message for three files", () => {
    const files = [
      new File(["hello"], "hello.csv", { type: "text/csv" }),
      new File(["hello again"], "hello again.csv", { type: "text/csv" }),
      new File(["goodbye"], "goodbye.log", { type: "text/log" }),
    ];
    renderUploadDrop({ files });
    expect(screen.getByText(/remove additional files/)).toBeInTheDocument();
  });

  it("should have an error message for two csv files", () => {
    const files = [
      new File(["hello"], "hello.csv", { type: "text/csv" }),
      new File(["hello again"], "hello again.csv", { type: "text/csv" }),
    ];
    renderUploadDrop({ files });
    expect(screen.getByText(/replace one of your files/)).toBeInTheDocument();
  });

  describe("Errors from extracting Files", () => {
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
    const testDir = `${__dirname}/test-data`;
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

    it.skip("should have no error message for gps and dustrak pair", () => {
      const files = [
        new File(["hello"], "hello.csv", {
          type: "text/csv",
          text: async () => validDustrak.join("\n"),
        }),
        new File(["goodbye"], "goodbye.log", {
          type: "text/log",
          text: async () => validGps.join("\n"),
        }),
      ];
      renderUploadDrop({ files });
      expect(screen.queryByText(/Please/)).not.toBeInTheDocument();
    });

    it.skip("should have an error message for gps and dustrak pair", () => {
      const files = [
        new File(["hello"], "hello.csv", {
          type: "text/csv",
          text: async () => wrongDustrak.join("\n"),
        }),
        new File(["goodbye"], "goodbye.log", {
          type: "text/log",
          text: async () => validGps.join("\n"),
        }),
      ];
      renderUploadDrop({ files });
      expect(screen.queryByText(/Please/)).not.toBeInTheDocument();
    });
  });

  // May need to be an integration test placed on index test
  it.todo("should remove a file when click a trash icon");
  // Integration test on index
  it.todo("should proceed to the confirm page when there are two valid files");
});

const renderUploadDrop = ({
  files = [],
  setFiles = jest.fn(),
  proceedToConfirm = jest.fn(),
  setDustrakStart = jest.fn(),
  setDustrakEnd = jest.fn(),
  setGpsStart = jest.fn(),
} = {}) =>
  render(
    <UploadDrop
      {...{
        files,
        setFiles,
        proceedToConfirm,
        setDustrakStart,
        setDustrakEnd,
        setGpsStart,
      }}
    />
  );
