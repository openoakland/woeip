import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment-timezone";
import axios from "axios";

import { MapBox } from "./box";
import { MapMenu } from "./menu";

import {
  getCollectionsOnDate,
  fallbackCollection,
  fallbackPollutants,
  getPollutantsByCollectionId,
  getCollectionFileByLink,
  swapProtocol,
  canceledCollectionsMessage,
  canceledPollutantsMessage,
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
  const [formattedDate, setFormattedDate] = useState(initialDate.format("YYYY-MM-DD"))
  const [collectionsOnDate, setCollectionsOnDate] = useState([]);
  const [activeCollection, setActiveCollection] = useState({});
  const [activeId, setActiveId] = useState(-1);
  const [gpsFile, setGpsFile] = useState("");
  const [dustrakFile, setDustrakFile] = useState("");
  const [gpsFileUrl, setGpsFileUrl] = useState("");
  const [dustrakFileUrl, setDustrakFileUrl] = useState("");
  const [pollutants, setPollutants] = useState([]);
  const [isPendingResponse, setIsPendingResponse] = useState(false);

  /**
   * Call the api to get collection sessions that happened on a date
   */
  useEffect(() => {
    const source = axios.CancelToken.source();
    (async () => {
      try {
        const pendingCollectionsOnDate = await getCollectionsOnDate(
          formattedDate,
          source
        );
        setCollectionsOnDate(pendingCollectionsOnDate);
        const fallbackActive = fallbackCollection(pendingCollectionsOnDate)
        const { id, collection_files: collectionFiles } = fallbackActive;
        console.log(collectionFiles);
        const [ activeGpsFile, activeDustrakFile] = collectionFiles;
        setActiveCollection(fallbackActive);
        setActiveId(id);
        if(id && id > -1) setIsPendingResponse(true);
        if(activeGpsFile && activeDustrakFile){
          setGpsFile(activeGpsFile);
          setDustrakFile(activeDustrakFile);
        };
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
      if(activeId && activeId > -1){
        try {
          const pendingPollutantValues = await getPollutantsByCollectionId(
            activeId,
            source
          );
          setPollutants(fallbackPollutants(pendingPollutantValues));
        } catch (thrown) {
          canceledPollutantsMessage(thrown);
        } finally{
          setIsPendingResponse(false);
        }
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
      if(gpsFile && dustrakFile){
        try {
          const [pendingGpsFile, pendingDustrakFile] = await Promise.all([
            getCollectionFileByLink(swapProtocol(gpsFile), source),
            getCollectionFileByLink(swapProtocol(dustrakFile), source),
          ]);
          setGpsFileUrl(swapProtocol(pendingGpsFile.file));
          setDustrakFileUrl(swapProtocol(pendingDustrakFile.file));
        } catch {
          console.error("could not retrieve files for collection");
        }
      }
    })();

    return source.cancel;
  }, [gpsFile, dustrakFile]);

  const clearActiveCollection = () => {
    setGpsFile("");
    setDustrakFile("");
    setGpsFileUrl("");
    setDustrakFileUrl("");
    setPollutants([]);
  };

  /**
   * Load collections from a new date
   * @param {HTMLButtonEvent} event Accept the data from the calendar to start loading a date
   * @modifies {api} Cancel any pending loads
   * @modifies {isLoadingCollectionsOnDate}
   * @modifies {mapDate}
   * @modifies {cancelTokenSource}
   */
  const stageLoadingDate = async (_event, data) => {
    const rawDate = data.value;
    // guard against double click
    if (rawDate) {
      clearActiveCollection();
      const newMapDate = moment(rawDate.toISOString())
      setMapDate(newMapDate);
      setFormattedDate(newMapDate.format("YYYY-MM-DD"));
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
  const stageLoadingCollection = (pendingCollection) => {
    //guard against double click
    if (pendingCollection.id) {
      clearActiveCollection();
      setActiveId(pendingCollection.id);
      setActiveCollection(pendingCollection);
      setIsPendingResponse(true);
    }
  };

  return (
    <Grid columns={2} textAlign="left">
      <Grid.Column size="massive">
        <MapBox isLoading={isPendingResponse} pollutants={pollutants} />
      </Grid.Column>
      <Grid.Column>
        <MapMenu
          mapDate={mapDate}
          collectionsOnDate={collectionsOnDate}
          activeCollection={activeCollection}
          stageLoadingDate={stageLoadingDate}
          stageLoadingCollection={stageLoadingCollection}
          gpsFileUrl={gpsFileUrl}
          dustrakFileUrl={dustrakFileUrl}
        />
      </Grid.Column>
    </Grid>
  );
};
