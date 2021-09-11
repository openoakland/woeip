import moment from "moment-timezone";
import { PropTypes } from "prop-types";

import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";

import SemanticDatepicker from "react-semantic-ui-datepickers";
import { Container, ErrorMessage, List, WarningMessage } from "../ui";
import { sessionIdDisplay } from "./menu.util";
import {
  FILE_MESSAGES,
  ACTIVE_COLLECTION_ID_MESSAGES,
  ACTIVE_COLLECTION_ID_STATES,
} from "./constants";
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
  isPendingResponse,
  mapDate,
  collectionsOnDate,
  activeCollection,
  stageLoadingDate,
  stageLoadingCollection,
  gpsFileUrl,
  dustrakFileUrl,
  errorMessage,
}) => {
  /**
   * From the collections, composed React Components to display each collection
   * Exclude the active collection
   */
  const activeCollectionId = activeCollection.id;
  console.log('activeCollectionId', activeCollectionId);
  const collectionsDisplay = collectionsOnDate
    .filter((eachCollection) => eachCollection.id !== activeCollectionId)
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
          <b>Session:</b>
          {sessionIdDisplay(activeCollectionId)}
        </List.Item>
        <b>Start Time:</b>{" "}
        {activeCollection.starts_at
          ? moment(activeCollection.starts_at).format("h:mm A")
          : "Data for start time are not available"}
        {!FILE_MESSAGES[gpsFileUrl] ? (
          <List.Item as="a" href={gpsFileUrl}>
            Download GPS File
          </List.Item>
        ) : (
          <List.Item>{FILE_MESSAGES[gpsFileUrl]}</List.Item>
        )}
        {!FILE_MESSAGES[dustrakFileUrl] ? (
          <List.Item as="a" href={dustrakFileUrl}>
            Download DusTrak File
          </List.Item>
        ) : (
          <List.Item>{FILE_MESSAGES[dustrakFileUrl]}</List.Item>
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
      {!isPendingResponse && activeCollectionId === ACTIVE_COLLECTION_ID_STATES.NONE_FOUND && (
        <WarningMessage>
          {ACTIVE_COLLECTION_ID_MESSAGES[activeCollectionId]}
        </WarningMessage>
      )}
      { !isPendingResponse && errorMessage && <ErrorMessage>{ errorMessage }</ErrorMessage>}
    </Container>
  );
};

MapMenu.propTypes = {
  isPendingResponse: PropTypes.bool,
  mapDate: PropTypes.object,
  collectionsOnDate: PropTypes.array,
  activeCollection: PropTypes.object,
  stageLoadingDate: PropTypes.func,
  stageLoadingCollection: PropTypes.func,
  gpsFileUrl: PropTypes.string,
  dustrakFileUrl: PropTypes.string,
  errorMessage: PropTypes.string,
};
