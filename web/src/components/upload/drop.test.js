import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import fs from "fs";
import { UploadDrop } from "./drop";

describe("Actions after extracting files", () => {
  let validGps;
  let validDustrak;
  let wrongDustrak;

  let csvFileValid;
  let csvFileWrong;
  let logFile;
  /**
   * It is time-intensive to extract files.
   * Run the process exactly once and make the data available to the whole test block
   */
  const testDir = `${__dirname}/test-data`;
  beforeAll(async () => {
    const readFile = (path, opts = "utf8") =>
      new Promise((resolve, reject) => {
        fs.readFile(path, opts, (err, data) => {
          if (err) reject(`error: ${err}`);
          else resolve(data.toString());
        });
      });

    const fileNames = ["valid.log", "valid.csv", "wrong.csv"];
    const filePromises = [];
    for (const file of fileNames) {
      const filePomise = readFile(`${testDir}/${file}`);
      filePromises.push(filePomise);
    }

    [validGps, validDustrak, wrongDustrak] = await Promise.all(filePromises);

    csvFileValid = new File(["file"], "file.csv", {
      type: "text/csv",
    });
    csvFileValid.text = async () => validDustrak;

    csvFileWrong = new File(["csvFileWrong"], "csvFileWrong.csv", {
      type: "text/csv",
    });
    csvFileWrong.text = async () => wrongDustrak;

    logFile = new File(["file"], "file.log", {
      type: "text/log",
    });
    logFile.text = async () => validGps;
  });

  afterAll(() => {
    validGps = null;
    validDustrak = null;
    wrongDustrak = null;

    csvFileValid = null;
    csvFileWrong = null;
    logFile = null;
  });

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
    expect(screen.getAllByRole("button")[1].childNodes[0].className).toMatch(
      "trash"
    );
  });

  it("should have an error message for three files", () => {
    const files = [csvFileValid, csvFileValid, logFile];
    renderUploadDrop({ files });
    expect(screen.getByText(/remove additional files/)).toBeInTheDocument();
  });

  it("should have an error message for two csv files", () => {
    const files = [csvFileValid, csvFileValid];
    renderUploadDrop({ files });
    expect(screen.getByText(/replace one of your files/)).toBeInTheDocument();
  });

  it("should have no error message for gps and dustrak pair", async () => {
    renderUploadDrop({ files: [csvFileValid, logFile] });
    await waitFor(() => {
      expect(screen.getByText(/Pending Files/)).toBeInTheDocument();
      expect(screen.queryByText(/Please/)).not.toBeInTheDocument();
    });
  });

  it("should have an error message for gps and dustrak pair", async () => {
    renderUploadDrop({ files: [csvFileWrong, logFile] });
    await waitFor(() =>
      expect(screen.getByText(/Try again/)).toBeInTheDocument()
    );
  });

  it("should remove a file when click a trash icon", () => {
    const files = [csvFileValid, csvFileWrong, logFile];
    const setFiles = jest.fn();
    renderUploadDrop({ files, setFiles });
    const trashButtons = screen.getAllByRole("button");
    expect(trashButtons).toHaveLength(4);
    fireEvent.click(trashButtons[1]);
    expect(setFiles).toHaveBeenCalledWith([files[1], files[2]]);
  });

  it("should proceed to the confirm page when there are two valid files", async () => {
    const files = [csvFileValid, logFile];
    const proceedToConfirm = jest.fn();
    renderUploadDrop({ files, proceedToConfirm });
    await waitFor(() => expect(proceedToConfirm).toHaveBeenCalled());
  });
});

const renderUploadDrop = ({
  files = [],
  setFiles = jest.fn(),
  proceedToConfirm = jest.fn(),
  setDustrakStart = jest.fn(),
  setDustrakEnd = jest.fn(),
  setDustrakSerial = jest.fn(),
} = {}) =>
  render(
    <UploadDrop
      {...{
        files,
        setFiles,
        proceedToConfirm,
        setDustrakStart,
        setDustrakEnd,
        setDustrakSerial,
      }}
    />
  );
