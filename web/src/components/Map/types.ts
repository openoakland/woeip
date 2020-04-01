export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Pollutant extends Coordinates {
  name: string
  timestamp: string
  value: number
}

export interface Viewport extends Coordinates {
  bearing: number
  pitch: number
  zoom: number
}

export interface PollutantValueResponse {
  time_geo: string
  pollutant: string
  value: number
}
