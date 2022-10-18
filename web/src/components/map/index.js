import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment-timezone";
import axios from "axios";

import { MapBox } from "./box";
import { MapMenu } from "./menu";

import "./index.css"

import {
  BLANK_ACTIVE_ID,
  getAllDates,
  getCollectionsOnDate,
  getFirstCollection,
  parsePollutants,
  getPollutantsByCollectionId,
  getCollectionFileByLink,
  BLANK_ACTIVE_STARTS_AT,
  THROWN_CODE,
  mergePollutants,
  spatializePollutants,
  EMPTY_POLLUTANTS,
} from "./utils";

import { emptyProtocol } from "../../api.util";

import { Container, Grid } from "../ui";

/**
 * View Map of data sessions and related meta-data
 */
export const Map = () => {
  const location = useLocation(); // location for the url
  const initialDate = moment(location?.state?.date); // Date either from upload or current day (moment(undefined) gives now)
  const [mapDate, setMapDate] = useState(initialDate);
  const [formattedDate, setFormattedDate] = useState(
    initialDate.format("YYYY-MM-DD")
  );
  const [allDatesUnique, setAllDatesUnique] = useState(() => new Set()); // Lazy initial render
  const [collectionsOnDate, setCollectionsOnDate] = useState([]);
  const [activeId, setActiveId] = useState(BLANK_ACTIVE_ID);
  const [activeStartsAt, setActiveStartsAt] = useState(BLANK_ACTIVE_STARTS_AT);
  // the database endpoint for file metadata
  const [gpsFile, setGpsFile] = useState("");
  const [dustrakFile, setDustrakFile] = useState("");
  // the direct download link for the file itself
  const [gpsFileUrl, setGpsFileUrl] = useState("");
  const [dustrakFileUrl, setDustrakFileUrl] = useState("");
  const [pollutants, setPollutants] = useState(EMPTY_POLLUTANTS);
  const [isLoadingPollutants, setIsLoadingPollutants] = useState(false);

  /**
   * Load a Set of all dates with at least one collection
   * @modifies {api} calls to get one collection per date that has any
   * @modifies {allDatesUnique}
   * @modifies {mapDate}
   * @returns {axios.CancelToken.source().cancel} cancel the api call
   */
  useEffect(() => {
    const source = axios.CancelToken.source();
    (async () => {
      const { allDates, thrownCode } = await getAllDates(source);
      if (thrownCode === THROWN_CODE.NONE) {
        setAllDatesUnique(new Set(allDates));
        const latestDate = allDates.reduce(
          (maxDate, dateStr) => (dateStr > maxDate ? dateStr : maxDate), // alphabetical comparison
          "0000-00-00"
        );
        /* If there's at least one collection date, go automatically to either
         * the date of the most recent upload (preferred) or the most recent
         * collection date. `latestDate`` should only be "0000-00-00" if the
         * collections table is empty.
         */
        if (latestDate !== "0000-00-00") {
          setMapDate(moment(location?.state?.date ?? latestDate));
        }
      }
    })();
    return source.cancel;
  }, [location]);

  /**
   * Load the collections that happened on a date
   * @param {string} formattedDate
   * @modifies {api} calls to get collections on a date
   * @modifies {collectionsOnDate}
   * @modifies {activeId}
   * @modifies {activeStartsAt}
   * @modifies {gpsFile}
   * @modifies {dustrakFile}
   * @returns {axios.CancelToken.source().cancel} cancel the api call
   */
  useEffect(() => {
    const source = axios.CancelToken.source();
    (async () => {
      const { collectionsOnDate: localCollectionsOnDate, thrownCode } =
        await getCollectionsOnDate(formattedDate, source);
      if (thrownCode === THROWN_CODE.NONE) {
        setCollectionsOnDate(localCollectionsOnDate);
        const {
          id,
          collection_files: [localGpsFile, localDustrakFile],
          starts_at,
        } = getFirstCollection(localCollectionsOnDate);
        setActiveId(id);
        setActiveStartsAt(starts_at);
        if (localGpsFile && localDustrakFile) {
          setGpsFile(localGpsFile);
          setDustrakFile(localDustrakFile);
        }
      }
    })();
    return source.cancel;
  }, [formattedDate]);

  /**
   * Load pollutants from the active collection
   * @param {number} activeId
   * @modifies {api} calls to the collection endpoint to retrieve its pollutants
   * @modifies {isLoadingPollutants} update the status of pending pollutants
   * @modifies {pollutants} will be an empty array or filled with pollutants from collection
   * @returns {axios.CancelToken.source().cancel} cancel the api call
   */
  useEffect(() => {
    const source = axios.CancelToken.source();
    (async () => {
      if (activeId !== BLANK_ACTIVE_ID) {
        setIsLoadingPollutants(true);
        const { pollutants: rawPollutants, thrownCode } =
          await getPollutantsByCollectionId(activeId, source);
        if (thrownCode === THROWN_CODE.NONE) {
          const parsed = parsePollutants(rawPollutants);
          const merged = mergePollutants(parsed);
          const spatialized = spatializePollutants(merged);
          setPollutants(spatialized);
        }
        if (thrownCode !== THROWN_CODE.CANCELED) setIsLoadingPollutants(false);
      } else {
        setIsLoadingPollutants(false);
      }
    })();
    return source.cancel;
  }, [activeId]);

  /**
   * Call the api to load the urls for gps and dustrak source files of a collection
   * @param {string} gpsFile
   * @param {string} dustrakFile
   * @modifies {api} calls to the each url for the gps and dustrak files
   * @modifies {gpsFileUrl}
   * @modifies {dustrakFileUrl}
   * @returns {axios.CancelToken.source().cancel} cancel the api call
   */
  useEffect(() => {
    const source = axios.CancelToken.source();
    (async () => {
      if (gpsFile || dustrakFile) {
        const [
          { file: localGpsFile, thrownCode: thrownCodeGps },
          { file: localDustrakFile, thrownCode: thrownCodeDustrak },
        ] = await Promise.all([
          getCollectionFileByLink(emptyProtocol(gpsFile), source),
          getCollectionFileByLink(emptyProtocol(dustrakFile), source),
        ]);

        if (thrownCodeGps === THROWN_CODE.NONE)
          setGpsFileUrl(emptyProtocol(localGpsFile.file));
        if (thrownCodeDustrak === THROWN_CODE.NONE)
          setDustrakFileUrl(emptyProtocol(localDustrakFile.file));
      }
    })();

    return source.cancel;
  }, [gpsFile, dustrakFile]);

  /**
   * Load collections from a new date
   * @param {HTMLButtonEvent} event Accept the data from the calendar to start loading a date
   * @modifies {mapDate}
   * @modifies {formattedDate}
   * @modifies {activeId}
   * @modifies {activeStartsAt}
   * @modifies {gpsFile}
   * @modifies {dustrakFile}
   * @modifies {gpsFileUrl}
   * @modifies {dustrakFileUrl}
   * @modifies {pollutants}
   */
  const changeMapDate = async (_event, data) => {
    const rawDate = data.value;
    // guard against double clicks
    if (rawDate) {
      const newMapDate = moment(rawDate.toISOString());

      setMapDate(newMapDate);
      setFormattedDate(newMapDate.format("YYYY-MM-DD"));
      setCollectionsOnDate([]);

      setActiveId(BLANK_ACTIVE_ID);
      setActiveStartsAt(BLANK_ACTIVE_STARTS_AT);

      setGpsFile("");
      setDustrakFile("");
      setGpsFileUrl("");
      setDustrakFileUrl("");

      setPollutants(EMPTY_POLLUTANTS);
    }
  };

  /**
   * Load a new collection from the current date
   * @param {import('./utils').Collection} collection the collection to change to
   * @modifies {activeId}
   * @modifies {activeStartsAt}
   * @modifies {gpsFile}
   * @modifies {dustrakFile}
   * @modifies {gpsFileUrl}
   * @modifies {dustrakFileUrl}
   * @modifies {pollutants}
   */
  const changeActiveCollection = (collection) => {
    //guard against double click
    if (collection.id) {
      const {
        id,
        collection_files: [localGpsFile, localDustrakFile],
        starts_at,
      } = collection;
      setActiveId(id);
      setActiveStartsAt(starts_at);

      setGpsFile(localGpsFile);
      setDustrakFile(localDustrakFile);
      setGpsFileUrl("");
      setDustrakFileUrl("");

      setPollutants(EMPTY_POLLUTANTS);
    }
  };

  return (
    <Container>
      <Grid relaxed='very'>
        <Grid.Column width={10}>
          <div className="mapBoxSquare">
            <MapBox isLoading={isLoadingPollutants} pollutants={pollutants} />
          </div>
        </Grid.Column>
        <Grid.Column width={6}>
          <MapMenu
            mapDate={mapDate}
            allDatesUnique={allDatesUnique}
            collectionsOnDate={collectionsOnDate}
            activeId={activeId}
            activeStartsAt={activeStartsAt}
            changeMapDate={changeMapDate}
            changeActiveCollection={changeActiveCollection}
            gpsFileUrl={gpsFileUrl}
            dustrakFileUrl={dustrakFileUrl}
          />
        </Grid.Column>
      </Grid>
    </Container>
  );
};
