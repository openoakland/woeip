import {
  INIT_GPS_FILE_URL,
  INIT_DUSTRAK_FILE,
  INIT_ACTIVE_COLLECTION,
  INIT_DUSTRAK_FILE_URL,
} from ".";

import { MapMenu } from "./menu";
import { render, screen } from "@testing-library/react";
import moment from "moment";

jest.mock("./box", () => () => <></>);

describe("renders the MapMenu", () => {
  it("should render with default values, indicating they are invalid", () => {
    renderMapMenu();
    expect(
      screen.getByText("Pending valid collection from database")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("We haven't collected data for this time period.")
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Data for start time are not available")
    ).toBeInTheDocument();
    screen.debug();
  });

  it("should trigger a reset of collection when new one selected", () => {
    // const activeCollectionStart =
    const secondActiveCollection = { id: 1, starts_at: moment() };
  });
});

const renderMapMenu = ({
  mapDate = moment(),
  collectionsOnDate = [],
  activeCollection = INIT_ACTIVE_COLLECTION,
  stageLoadingDate = jest.fn(),
  stageLoadingCollection = jest.fn(),
  gpsFileUrl = INIT_GPS_FILE_URL,
  dustrakFileUrl = INIT_DUSTRAK_FILE_URL,
} = {}) =>
  render(
    <MapMenu
      {...{
        mapDate,
        collectionsOnDate,
        activeCollection,
        stageLoadingDate,
        stageLoadingCollection,
        gpsFileUrl,
        dustrakFileUrl,
      }}
    />
  );
