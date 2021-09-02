import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import moment from "moment-timezone";
import axios from "axios";
import { apiUrlCollections } from "../../api.util";

export const Map = () => {
    const location = useLocation(); // location for the url
    // const initialDate = moment(location?.state?.date) || moment();
    const initialDate = moment("07/23/2014") || moment();
    const [mapDate, setMapDate] = useState(initialDate);
    const [collectionsOnDate, setCollectionsOnDate] = useState([]);
    const [collectionsTokenSource, setCollectionsTokenSource]  = useState(axios.CancelToken.source());
    const [pollutants, setPollutants] = useState([]);
    const [pollutantsTokenSource, setPollutantsTokenSource] = useState(axios.CancelToken.source());

    useEffect(() => {
        console.log('once on mount!');
        console.log(mapDate);
        console.log("start date", location?.state?.date);
        // get collections on date
        (async () => {
            const options = {
                params: {
                    start_date: mapDate.format("YYYY-MM-DD"),
                },
                cancelToken: collectionsTokenSource.source,
            };
            console.log('collectionsTokenSource', collectionsTokenSource);
            const rawCollectionsOnDate = await axios.get(apiUrlCollections(), options);
            const collectionsOnDateData = rawCollectionsOnDate.data
            if(collectionsOnDateData){
                console.log('collectionsOnDateData', collectionsOnDateData);
                setCollectionsOnDate(collectionsOnDateData);
                const activeCollection = collectionsOnDateData[collectionsOnDateData.length - 1]

            } else {
                setCollectionsOnDate([]);
                setPollutants([]);
            };
            console.log('rawCollectionsOnDate', (rawCollectionsOnDate));
            // setCollectionsOnDate
        })();
        return () => {
            collectionsTokenSource.cancel();
            pollutantsTokenSource.cancel();
        };
    }, [])

    return(
        <div>Hello, Map Data!
            <button onClick={() => collectionsTokenSource.cancel()}>Cancel Collection Call</button>
            <p>Collections on Date:</p>
            {collectionsOnDate.map((collection) => {
                return(
                    <div>
                        <p>A collection</p>
                        <p>{collection.id}</p>
                    </div>
                )
            })}
        </div>
    )
}
