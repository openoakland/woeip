import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import { MapMenu } from "./menu";
import { BLANK_ACTIVE_ID } from "./utils";

describe("MapMenu", () => {
  let mapDate;
  let firstCollection;
  let secondCollection;
  beforeAll(() => {
    mapDate = moment("2014-07-17");
    firstCollection = {
      id: 0,
      collection_files: ["//gps.io", "//dustrak.io"],
      starts_at: "2014-07-17T19:40:35Z",
    };
    secondCollection = {
      id: 1,
      collection_files: ["//gps-second.io", "//dustrak-second.io"],
      starts_at: "2014-07-17T12:40:35Z",
    };
  });

  it("should render the default map menu, with no collections", () => {
    renderMapMenu({ mapDate });
    expect(screen.getByText(mapDate.format("LL"))).toBeInTheDocument();
    expect(screen.getByText("No GPS File")).toBeInTheDocument();
    expect(screen.getByText("No Dustrak File")).toBeInTheDocument();
    expect(screen.getByText("Session:").closest("div")).toHaveTextContent(
      "None"
    );
    expect(screen.getByText("Start Time:").closest("div")).toHaveTextContent(
      "None"
    );
    expect(
      screen.getByText(/We haven't collected data for this time period./)
    ).toBeInTheDocument();
    expect(screen.getByTestId("datepicker-input").value).toMatch(
      mapDate.format("YYYY-MM-DD")
    );
  });

  it("should render a single collection", () => {
    const collectionsOnDate = [firstCollection];
    const activeId = firstCollection.id;
    const activeStartsAt = firstCollection.starts_at;
    const gpsFileUrl = firstCollection.collection_files[0];
    const dustrakFileUrl = firstCollection.collection_files[1];

    renderMapMenu({
      mapDate,
      collectionsOnDate,
      activeId,
      activeStartsAt,
      gpsFileUrl,
      dustrakFileUrl,
    });

    expect(screen.getByText(mapDate.format("LL"))).toBeInTheDocument();
    expect(screen.getByText("Session:").closest("div")).toHaveTextContent(
      activeId
    );
    expect(
      screen.getByText(moment(activeStartsAt).format("h:mm A"))
    ).toBeInTheDocument();
    expect(screen.getByText(/GPS File/).href).toMatch(gpsFileUrl);
    expect(screen.getByText(/DusTrak File/).href).toMatch(dustrakFileUrl);
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("should render a multiple collections", () => {
    const collectionsOnDate = [firstCollection, secondCollection];
    const activeId = secondCollection.id;
    const activeStartsAt = secondCollection.starts_at;
    const gpsFileUrl = secondCollection.collection_files[0];
    const dustrakFileUrl = secondCollection.collection_files[1];

    renderMapMenu({
      mapDate,
      collectionsOnDate,
      activeId,
      activeStartsAt,
      gpsFileUrl,
      dustrakFileUrl,
    });

    expect(screen.getByText(mapDate.format("LL"))).toBeInTheDocument();
    const sessions = screen.getAllByText("Session:");
    expect(sessions[0].closest("div")).toHaveTextContent(activeId);
    expect(sessions[1].closest("a")).toHaveTextContent(firstCollection.id);
    expect(
      screen.getByText(moment(activeStartsAt).format("h:mm A"))
    ).toBeInTheDocument();
    expect(screen.getByText(/GPS File/).href).toMatch(gpsFileUrl);
    expect(screen.getByText(/DusTrak File/).href).toMatch(dustrakFileUrl);
    expect(screen.queryByText("None")).not.toBeInTheDocument();
  });

  it("should change the active collection when clicking another one", () => {
    const collectionsOnDate = [firstCollection, secondCollection];
    const activeId = firstCollection.id;
    const changeActiveCollection = jest.fn();
    renderMapMenu({ activeId, collectionsOnDate, changeActiveCollection });
    userEvent.click(
      screen.getByText(
        new RegExp(moment(secondCollection.starts_at).format("h:mm A"), "i")
      )
    );
    expect(changeActiveCollection).toHaveBeenCalled();
  });

  it("should change the collection date when clicking the map", () => {
    const changeMapDate = jest.fn();
    renderMapMenu({ changeMapDate });
    userEvent.click(screen.getByTestId("datepicker-input"));
    // the event is fired when the day changes- not when the datepicker is clicked.
    expect(changeMapDate).not.toHaveBeenCalled();
    // the 19th is a day that should always be in the month and not conflict with other text values
    userEvent.click(screen.getByText("19"));
    expect(changeMapDate).toHaveBeenCalled();
  });
});

const renderMapMenu = ({
  mapDate = moment(),
  collectionsOnDate = [],
  activeId = BLANK_ACTIVE_ID,
  activeStartsAt = "",
  changeMapDate = jest.fn(),
  changeActiveCollection = jest.fn(),
  gpsFileUrl = "",
  dustrakFileUrl = "",
} = {}) =>
  render(
    <MapMenu
      {...{
        mapDate,
        collectionsOnDate,
        activeId,
        activeStartsAt,
        changeMapDate,
        changeActiveCollection,
        gpsFileUrl,
        dustrakFileUrl,
      }}
    />
  );
