import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment-timezone";
import axios from "axios";
import { apiUrlCollectionById, apiUrlCollections } from "../../api.util";

export const Map = () => {
  const location = useLocation(); // location for the url
  // const initialDate = moment(location?.state?.date) || moment();
  const initialDate = moment("07/23/2014") || moment();
  const [activeCollection, setActiveCollection] = useState({});
  const [mapDate, setMapDate] = useState(initialDate);
  const [collectionsOnDate, setCollectionsOnDate] = useState([]);
  const [collectionsTokenSource, setCollectionsTokenSource] = useState(
    axios.CancelToken.source()
  );
  const [pollutants, setPollutants] = useState([]);
  const [isPendingResponse, setIsPendingResponse] = useState(true);
  const [pollutantsTokenSource, setPollutantsTokenSource] = useState(
    axios.CancelToken.source()
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // console.log('once on mount!');
    // console.log(mapDate);
    // console.log("start date", location?.state?.date);
    (async () => {
      const options = {
        params: {
          start_date: mapDate.format("YYYY-MM-DD"),
        },
        cancelToken: collectionsTokenSource.source,
      };
      console.log("collectionsTokenSource", collectionsTokenSource);
      // Get the collections on the day
      let rawCollectionsOnDate;
      try {
        rawCollectionsOnDate = await axios.get(apiUrlCollections(), options);
      } catch {
        resetData();
        setErrorMessage("error fetching collections");
        return;
      }
      const collectionsOnDateData = rawCollectionsOnDate.data;
      if (!collectionsOnDateData) {
        resetData();
        setErrorMessage("error reading collection data");
        return;
      }

      if (!collectionsOnDateData.length) {
        resetData();
        setErrorMessage("error no collections found on date");
        return;
      } else {
        setCollectionsOnDate(collectionsOnDateData);
        const activeCollection =
          collectionsOnDateData[collectionsOnDateData.length - 1];
        if (!activeCollection.id) {
          resetData();
          setErrorMessage("error no collection id");
          return;
        }
        setActiveCollection(activeCollection);
        // get the pollutants from the first collection of the day
        let rawPollutantsOnDate;
        try {
          const options = {
            cancelToken: pollutantsTokenSource.token,
          };
          rawPollutantsOnDate = await axios.get(
            apiUrlCollectionById(activeCollection.id),
            options
          );
        } catch {
          resetData();
          setErrorMessage("error fetching pollutant data");
        }
        const rawPollutantsOnDateData = rawPollutantsOnDate.data;
        if (!rawPollutantsOnDateData) {
          // no need to reset the collections data under this circumstance.
          // they were already validated.
          resetData();
          setErrorMessage("error no pollutants");
          return;
        } else {
          setPollutants(rawPollutantsOnDateData);
        }
      }
      // Conditions
      // There are no data
      // There are no collections
      // There are collections and data
      if (collectionsOnDateData) {
        console.log("collectionsOnDateData", collectionsOnDateData);
        setCollectionsOnDate(collectionsOnDateData);
        const activeCollection =
          collectionsOnDateData[collectionsOnDateData.length - 1];
        // get the pollutants from the day
        // try {
        //     const options = {
        //         cancelToken: pollutantsTokenSource.token
        //     }
        //     // activeCollection.id &&
        // } catch {

        // }

        // set the active collection to the present one
      } else {
        setCollectionsOnDate([]);
        setPollutants([]);
      }
      console.log("rawCollectionsOnDate", rawCollectionsOnDate);
      // setCollectionsOnDate
    })();
    return () => {
      collectionsTokenSource.cancel();
      pollutantsTokenSource.cancel();
    };
  }, []);

  const resetData = () => {
    setIsPendingResponse(false);
    setCollectionsOnDate([]);
    setCollectionsTokenSource(axios.CancelToken.source());
    setPollutants([]);
    setPollutantsTokenSource(axios.CancelToken.source());
  };

  // TODO: When picking a new date, reset all of the data?

  return (
    <div>
      Hello, Map Data!
      <p>Error: {errorMessage}</p>
      <p>Is pending reponse: {isPendingResponse ? "yes" : "no"}</p>
      <button onClick={() => collectionsTokenSource.cancel()}>
        Cancel Collection Call
      </button>
      <p>Count of Collections on Date: {collectionsOnDate.length}</p>
      <p>Count of pollutants on Data: {pollutants.length}</p>
      {/* {collectionsOnDate.map((collection) => {
                return(
                    <div>
                        <p>A collection</p>
                        <p>{collection.id}</p>
                    </div>
                )
            })} */}
    </div>
  );
};
