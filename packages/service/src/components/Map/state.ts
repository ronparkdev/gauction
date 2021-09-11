import { LocalStorage } from 'service/stores/permanent/localStorage'

const STATE_KEY = 'lastMapState'

export interface MapState {
  latitude: number
  longitude: number
  level: number
}

const DEFAULT_MAP_STATE = {
  latitude: 33.450701,
  longitude: 126.570667,
  level: 3,
}

const read = (): MapState => (LocalStorage.get(STATE_KEY) as MapState) || DEFAULT_MAP_STATE

const write = (state: MapState) => LocalStorage.set(STATE_KEY, state)

export const MapState = { read, write }
