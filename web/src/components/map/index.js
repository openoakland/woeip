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
  BLANK_ACTIVE_STARTS_AT,
  THROWN_CODE,
} from "./utils";

import { emptyProtocol } from "../../api.util";

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
      const {
        collectionsOnDate: localCollectionsOnDate,
        thrownCode,
      } = await getCollectionsOnDate(formattedDate, source);
      if (thrownCode === THROWN_CODE.NONE) {
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
        setIsLoadingPollutants(true);
        const {
          pollutants: rawPollutants,
          thrownCode,
        } = await getPollutantsByCollectionId(activeId, source);
        if (thrownCode === THROWN_CODE.NONE)
          setPollutants(fallbackPollutants(rawPollutants));
        if (thrownCode !== THROWN_CODE.CANCELED) setIsLoadingPollutants(false);
      } else {
        setIsLoadingPollutants(false);
      }
    })();
    return source.cancel;
  }, [activeId]);

  /**
   * Call the api to load the urls for gps+dustrak source files of a collection
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
