export const API_URL = process.env.NODE_ENV==='production' ? 'https://api.tangled.city' : 'http://api.lvh.me'
export const POLLUTANTS_PATH = 'collection/1/data'
export const MAP_STYLE = 'mapbox://styles/mapbox/streets-v11'
export const MAPBOX_ACCESS_TOKEN =
  process.env.MAPBOX_ACCESS_TOKEN ||
  'pk.eyJ1IjoibHVrZWh0cmF2aXMiLCJhIjoiY2p2djlmY2sxM3pzcDQzb2p3MXN3aGl2aSJ9.6b2Kp7pfaV-cNiwtYRhRZw'
