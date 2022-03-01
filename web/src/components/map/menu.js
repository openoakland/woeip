import moment from "moment-timezone";
import { PropTypes } from "prop-types";

import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";

import SemanticDatepicker from "react-semantic-ui-datepickers";
import { Container, List, WarningMessage } from "../ui";
import "./menu.css";
import { BLANK_ACTIVE_ID } from "./utils";

/**
 * Menu for Dates and Collections to map
 * @param {moment} mapDate Day viewed on mapped
 * @param {Array<import('./utils.js').Collection>} collectionsOnDate Collections from the viewed day
 * @param {number} activeId id of collection actively viewed on map
 * @param {string} activeStartsAt start time of the collection as it is stored in the database
 * @param {function} changeMapDate start the process to load collections on date
 * @param {function} changeActiveCollection start the process to load pollutants from a colletion
 * @param {string} gpsFileUrl url to a gps file
 * @param {string} dustrakFileUrl url to a dustrak file
 */
export const MapMenu = ({
  mapDate,
  setOfDates,
  collectionsOnDate,
  activeId,
  activeStartsAt,
  changeMapDate,
  changeActiveCollection,
  gpsFileUrl,
  dustrakFileUrl,
}) => {
  /**
   * From the collections, composed React Components to display each collection
   * Exclude the active collection
   */
  const otherCollectionsDisplay = collectionsOnDate
    .filter((collection) => collection.id !== activeId)
    .map((collection) => {
      const id = collection.id;
      const startsAt = collection.starts_at;
      return (
        <List.Item
          as="a"
          key={`${id}-${startsAt}`}
          onClick={() => changeActiveCollection(collection)}
          data-arg={id}
        >
          <b>Session: </b>
          {id}, starting at {moment(startsAt).format("h:mm A")}
        </List.Item>
      );
    });
  return (
    <Container>
      <h2>{mapDate.format("LL")}</h2>
      <p>View a different day:</p>
      <SemanticDatepicker
        onChange={changeMapDate}
        format="YYYY-MM-DD"
        value={mapDate.toDate()}
        clearable={false}
        filterDate={date => setOfDates.has(moment(date).format('YYYY-MM-DD'))}
      />
      <h3>Collection Details</h3>
      <List>
        <List.Item>
          <b>Session:</b> {activeId !== BLANK_ACTIVE_ID ? activeId : "None"}
        </List.Item>
        <b>Start Time:</b>{" "}
        {activeStartsAt ? moment(activeStartsAt).format("h:mm A") : "None"}
        {gpsFileUrl && (
          <List.Item as="a" href={gpsFileUrl}>
            Download GPS File
          </List.Item>
        )}
        {dustrakFileUrl && (
          <List.Item as="a" href={dustrakFileUrl}>
            Download DusTrak File
          </List.Item>
        )}
      </List>
      <h4>Other Collections from this day:</h4>
      <List>
        {otherCollectionsDisplay.length ? (
          otherCollectionsDisplay
        ) : (
          <List.Item>None</List.Item>
        )}
      </List>
      {activeId === BLANK_ACTIVE_ID && (
        <WarningMessage>
          We haven't collected data for this time period. Please select another
          date.
        </WarningMessage>
      )}
    </Container>
  );
};

MapMenu.propTypes = {
  mapDate: PropTypes.object,
  collectionsOnDate: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      collection_files: PropTypes.arrayOf(PropTypes.string),
      starts_at: PropTypes.string,
    })
  ),
  activeId: PropTypes.number,
  activeStartsAt: PropTypes.string,
  changeMapDate: PropTypes.func,
  changeActiveCollection: PropTypes.func,
  gpsFileUrl: PropTypes.string,
  dustrakFileUrl: PropTypes.string,
};
