import {render, screen} from '@testing-library/react'
import moment from 'moment';
import { MapMenu } from './menu';
import { BLANK_ACTIVE_ID } from './utils';

describe("MapMenu", () => {
    let mapDate;
    beforeAll(() => {
        mapDate = moment();
    });

    it("should render the default map menu, with no collections", () => {
        renderMapMenu({mapDate});
        expect(screen.getByText(mapDate.format("LL"))).toBeInTheDocument();
        expect(screen.getByText("No GPS File")).toBeInTheDocument();
        expect(screen.getByText("No Dustrak File")).toBeInTheDocument();
        expect(screen.getByText(/We haven't collected data for this time period./)).toBeInTheDocument();
    });

    it.skip("should render a single collection", () => {

    });

    it.skip("should render a multiple collections", () => {

    });

    it.skip("should change the active collection", () => {

    });

    it.skip("should change the collection data", () => {

    });
});

export function getByTextContent(textMatch) {
    return screen.getByText((content, node) => {
      const hasText = (node) => node.textContent === textMatch
      const nodeHasText = hasText(node)
      const childrenDontHaveText = Array.from(node?.children || []).every((child) => !hasText(child))
      return nodeHasText && childrenDontHaveText
    })
  }

const renderMapMenu = ({
    mapDate = moment(),
    collectionsOnDate = [],
    activeId = BLANK_ACTIVE_ID,
    activeStartsAt = '',
    changeMapDate = jest.fn(),
    changeActiveCollection = jest.fn(),
    gpsFileUrl = "",
    dustrakFileUrl = "",
} = {}) => render(<MapMenu {...{mapDate, collectionsOnDate, activeId, activeStartsAt, changeMapDate, changeActiveCollection, gpsFileUrl, dustrakFileUrl}}/>);
