import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment-timezone";
import axios from "axios";

import { MapBox } from "./box";
import { MapMenu } from "./menu";

import {
  BLANK_ACTIVE_ID,
  getCollectionsOnDate,
  getFirstCollection,
  fallbackPollutants,
  getPollutantsByCollectionId,
  getCollectionFileByLink,
  swapProtocol,
  canceledCollectionsMessage,
  canceledPollutantsMessage,
  BLANK_ACTIVE_STARTS_AT,
} from "./utils";

import { Grid } from "../ui";

/**
 * View Map of data sessions and related meta-data
 * Data are read only
 */
export const Map = () => {
  const location = useLocation(); // location for the url
  const initialDate = moment(location?.state?.date) || moment(); // Date either from upload or current day
  const [mapDate, setMapDate] = useState(initialDate);
  const [formattedDate, setFormattedDate] = useState(
    initialDate.format("YYYY-MM-DD")
  );
  const [collectionsOnDate, setCollectionsOnDate] = useState([]);
  const [activeId, setActiveId] = useState(BLANK_ACTIVE_ID);
  const [activeStartsAt, setActiveStartsAt] = useState(BLANK_ACTIVE_STARTS_AT);
  const [gpsFile, setGpsFile] = useState("");
  const [dustrakFile, setDustrakFile] = useState("");
  const [gpsFileUrl, setGpsFileUrl] = useState("");
  const [dustrakFileUrl, setDustrakFileUrl] = useState("");
  const [pollutants, setPollutants] = useState([]);
  const [isLoadingPollutants, setIsLoadingPollutants] = useState(false);

  /**
   * Call the api to get collection sessions that happened on a date
   */
  useEffect(() => {
    const source = axios.CancelToken.source();
    (async () => {
      try {
        const localCollectionsOnDate = await getCollectionsOnDate(
          formattedDate,
          source
        );
        setCollectionsOnDate(localCollectionsOnDate);
        const {
          id,
          collection_files: [localGpsFile, localDustrakFile],
          starts_at,
        } = getFirstCollection(localCollectionsOnDate);
        setActiveId(id);
        setActiveStartsAt(starts_at);
        if (id !== BLANK_ACTIVE_ID) setIsLoadingPollutants(true);
        if (localGpsFile && localDustrakFile) {
          setGpsFile(localGpsFile);
          setDustrakFile(localDustrakFile);
        }
      } catch (thrown) {
        canceledCollectionsMessage(thrown);
      }
    })();
    return source.cancel;
  }, [formattedDate]);

  /**
   * Load pollutants in collection
   */
  useEffect(() => {
    const source = axios.CancelToken.source();
    (async () => {
      if (activeId !== BLANK_ACTIVE_ID) {
        try {
          setIsLoadingPollutants(true);
          const pendingPollutantValues = await getPollutantsByCollectionId(
            activeId,
            source
          );
          setPollutants(fallbackPollutants(pendingPollutantValues));
          setIsLoadingPollutants(false);
        } catch (thrown) {
          canceledPollutantsMessage(thrown);
        }
      }
    })();
    return () => {
      setIsLoadingPollutants(false);
      source.cancel();
    };
  }, [activeId]);

  /**
   * Call the api to load the urls for gps+dustrak source files of a collection
   */
  useEffect(() => {
    const source = axios.CancelToken.source();
    (async () => {
      console.log("dustrakFile", dustrakFile);
      console.log("gpsFile", gpsFile);
      if (gpsFile || dustrakFile) {
        try {
          const [localGpsFile, localDustrakFile] = await Promise.all([
            getCollectionFileByLink(swapProtocol(gpsFile), source),
            getCollectionFileByLink(swapProtocol(dustrakFile), source),
          ]);
          setGpsFileUrl(swapProtocol(localGpsFile.file));
          setDustrakFileUrl(swapProtocol(localDustrakFile.file));
        } catch {
          console.error("could not retrieve files for collection");
        }
      }
    })();

    return source.cancel;
  }, [gpsFile, dustrakFile]);

  /**
   * Load collections from a new date
   * @param {HTMLButtonEvent} event Accept the data from the calendar to start loading a date
   * @modifies {api} Cancel any pending loads
   * @modifies {isLoadingCollectionsOnDate}
   * @modifies {mapDate}
   * @modifies {cancelTokenSource}
   */
  const changeMapDate = async (_event, data) => {
    const rawDate = data.value;
    // guard against double click
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

      setPollutants([]);
    }
  };

  /**
   * Load a new collection from the current date
   * @param {HTMLButtonEvent} event
   * @modifies {api} Cancel any pending loads
   * @modifies {shouldLoadCollections}
   * @modifies {collection}
   * @modifies {cancelTokenSource}
   */
  const changeActiveCollection = (pendingCollection) => {
    //guard against double click
    if (pendingCollection.id) {
      const {
        id,
        collection_files: [localGpsFile, localDustrakFile],
        starts_at,
      } = pendingCollection;
      // setIsLoadingPollutants(true);
      setActiveId(id);
      setActiveStartsAt(starts_at);

      setGpsFile(localGpsFile);
      setDustrakFile(localDustrakFile);
      setGpsFileUrl("");
      setDustrakFileUrl("");

      setPollutants([]);
    }
  };

  return (
    <Grid columns={2} textAlign="left">
      <Grid.Column size="massive">
        <MapBox isLoading={isLoadingPollutants} pollutants={pollutants} />
      </Grid.Column>
      <Grid.Column>
        <MapMenu
          mapDate={mapDate}
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
  );
};
