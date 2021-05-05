import moment from "moment-timezone";
import { PropTypes } from "prop-types";

import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";

import SemanticDatepicker from "react-semantic-ui-datepickers";
import { Container, List, WarningMessage } from "../ui";
import "./menu.css";

/**
 * Menu for Dates and Collections to map
 * @property {moment} mapDate Day viewed on mapped
 * @property {Array<Collection>} collectionsOnDate Collections from the viewed day
 * @property {Collection} activeCollection collection actively viewed on map
 * @property {function} stageLoadingDate start the process to load collections on date
 * @property {function} stageLoadingCollection start the process to load pollutants from a colletion
 * @property {string} gpsFileUrl url to a gps file
 * @property {string} dustrakFileUrl url to a dustrak file
 */
export const MapMenu = ({
  mapDate,
  collectionsOnDate,
  activeCollection,
  stageLoadingDate,
  stageLoadingCollection,
  gpsFileUrl,
  dustrakFileUrl,
}) => {
  /**
   * From the collections, composed React Components to display each collection
   * Exclude the active collection
   */
  const collectionsDisplay = collectionsOnDate
    .filter((eachCollection) => eachCollection.id !== activeCollection.id)
    .map((eachCollection) => {
      const id = eachCollection.id;
      const startsAt = eachCollection.starts_at;
      return (
        <List.Item
          as="a"
          key={`${id}-${startsAt}`}
          onClick={() => stageLoadingCollection(eachCollection)}
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
        onChange={stageLoadingDate}
        format="YYYY-MM-DD"
        value={mapDate.toDate()}
        clearable={false}
      />
      <h3>Collection Details</h3>
      <List>
        <List.Item>
          <b>Session:</b> {activeCollection.id || "None"}
        </List.Item>
        <b>Start Time:</b>{" "}
        {activeCollection.starts_at
          ? moment(activeCollection.starts_at).format("h:mm A")
          : "None"}
        {gpsFileUrl ? (
          <List.Item as="a" href={gpsFileUrl}>
            Download GPS File
          </List.Item>
        ) : (
          <List.Item>No GPS File</List.Item>
        )}
        {dustrakFileUrl ? (
          <List.Item as="a" href={dustrakFileUrl}>
            Download DusTrak File
          </List.Item>
        ) : (
          <List.Item>No Dustrak File</List.Item>
        )}
      </List>
      <h4>Other Collections from this day:</h4>
      <List>
        {collectionsDisplay.length ? (
          collectionsDisplay
        ) : (
          <List.Item>None</List.Item>
        )}
      </List>
      {!collectionsDisplay.length && 
        <WarningMessage>
          We haven't collected data for this time period. Please select another date.
        </WarningMessage>
      }
    </Container>
  );
};

MapMenu.propTypes = {
  mapDate: PropTypes.object,
  collectionsOnDate: PropTypes.array,
  activeCollection: PropTypes.object,
  stageLoadingDate: PropTypes.func,
  stageLoadingCollection: PropTypes.func,
  gpsFileUrl: PropTypes.string,
  dustrakFileUrl: PropTypes.string,
};
