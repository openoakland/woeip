import { render, screen } from "@testing-library/react";
import moment from "moment";
import { MapMenu } from "./menu";
import { BLANK_ACTIVE_ID } from "./utils";

describe("MapMenu", () => {
  let mapDate;
  let firstCollection = {
    id: 0,
    collection_files: ["gps.io", "dustrak.io"],
    starts_at: "2014-07-17T19:40:35Z",
  };
  beforeAll(() => {
    mapDate = moment();
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

  it.only("should render a single collection", () => {
    renderMapMenu({
      mapDate: mapDate,
      collectionsOnDate: [firstCollection],
      activeId: firstCollection.id,
      activeStartsAt: firstCollection.starts_at,
      gpsFileUrl: firstCollection.collection_files[0],
      dustrakFileUrl: firstCollection.collection_files[1],
    });
  });

  it.skip("should render a multiple collections", () => {});

  it.skip("should change the active collection", () => {});

  it.skip("should change the collection data", () => {});
});

export function getByTextContent(textMatch) {
  return screen.getByText((content, node) => {
    const hasText = (node) => node.textContent === textMatch;
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node?.children || []).every(
      (child) => !hasText(child)
    );
    return nodeHasText && childrenDontHaveText;
  });
}

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
