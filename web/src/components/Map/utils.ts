import axios, { AxiosResponse, CancelToken } from 'axios'
import { Pollutant, PollutantValue, Viewport } from 'components/Map/types'
import { PollutantResponse } from 'components/Map/types'
import { API_URL } from '../../constants'

export const initialViewport: Viewport = {
  zoom: 12,
  latitude: 37.812036,
  longitude: -122.286675,
  bearing: 0,
  pitch: 0
}

export const getPollutants = async (
  token: CancelToken,
  collectionId: number
): Promise<Pollutant[] | void> => {
  return axios
    .get<PollutantResponse>(`${API_URL}/collection/${collectionId}/data`, {
      cancelToken: token
    })
    .then((response: AxiosResponse<PollutantResponse>) => {
      return response.data.pollutant_values.map(parsePollutant)
    })
    .catch(error => console.log(error))
}

export const parsePollutant = (item: PollutantValue): Pollutant => {
  const timeGeoSplit = item.time_geo.split('(')
  const coordsSplit = timeGeoSplit[1].split(', ')
  return {
    timestamp: timeGeoSplit[0].trim(),
    longitude: Number(coordsSplit[0].trim()),
    latitude: Number(coordsSplit[1].replace(')', '').trim()),
    name: item.pollutant,
    value: item.value
  }
}
