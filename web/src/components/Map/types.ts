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

export interface PollutantValue {
  value: number
  time_geo: string
  pollutant: string
}

export interface PollutantResponse {
  pollutant_values: PollutantValue[]
}

export interface Collection {
  id: number
  starts_at: string
  ends_at: string
  collection_files: Array<string>
}
