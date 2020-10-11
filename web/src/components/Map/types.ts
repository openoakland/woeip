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
  id: number
  pollutant_values: any
  time_geo: string
  pollutant: string
  value: number
}

export interface Collection {
  id: number
  start_at: string
  ends_at: string
  collection_files: Array<string>
}
