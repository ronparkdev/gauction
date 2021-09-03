const STATE_KEY = 'lastMapState'

export interface MapState {
  latitude: number
  longitude: number
  level: number
}

const read = (): MapState => {
  const valueStr = localStorage.getItem(STATE_KEY)
  const value = valueStr && JSON.parse(valueStr)
  const defaultValue: MapState = {
    latitude: 33.450701,
    longitude: 126.570667,
    level: 3,
  }

  return value || defaultValue
}

const write = (state: MapState) => {
  localStorage.setItem(STATE_KEY, JSON.stringify(state))
}

export const MapState = { read, write }
