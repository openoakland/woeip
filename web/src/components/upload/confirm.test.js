import { UploadConfirm } from "./confirm";
import { render, screen } from "@testing-library/react";
import moment from "moment-timezone";

describe("Upload Confirm", () => {
  it("should render with a summary of data", () => {
    const device = { name: "A", serial: "1234" };
    const dustrakStart = moment();
    const dustrakEnd = moment();
    renderUploadConfirm({
      device,
      dustrakStart,
      dustrakEnd,
    });
    expect(screen.getByText(/Success/)).toBeInTheDocument();
    expect(
      screen.getByText(/Confirm your session details/)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Collection date/).value).toEqual(
      dustrakStart.format("MM/DD/YYYY")
    );
    expect(screen.getByLabelText(/Start Time/).value).toEqual(
      dustrakStart.format("h:mm A")
    );
    expect(screen.getByLabelText(/Device/).value).toEqual("A");
    expect(screen.getByText(/Save/).type).toBe("submit");
    expect(screen.getByText(/Cancel/).type).toBe("submit");
  });
});

const renderUploadConfirm = ({
  device = {},
  files = [],
  dustrakStart = moment(),
  dustrakEnd = moment(),
  clearDustrakTimes = jest.fn(),
  clearDustrakSerial = jest.fn(),
  clearFiles = jest.fn(),
  returnToDrop = jest.fn(),
} = {}) =>
  render(
    <UploadConfirm
      {...{
        device,
        files,
        dustrakStart,
        dustrakEnd,
        clearDustrakTimes,
        clearDustrakSerial,
        clearFiles,
        returnToDrop,
      }}
    />
  );
