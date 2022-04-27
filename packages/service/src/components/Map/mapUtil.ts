/* eslint-disable no-unused-vars */

import MapItemDataSource from 'service/datasources/mapItem'

import { MapState } from './state'

const getKakaoMapLibrary = () => (window as any).kakao.maps

const createKakaoMap = (container) => {
  const KakaoMap = getKakaoMapLibrary()

  const state = MapState.read()

  const options = {
    center: new KakaoMap.LatLng(state.latitude, state.longitude),
    level: state.level,
  }

  const map = new KakaoMap.Map(container, options)

  const mapTypeControl = new KakaoMap.MapTypeControl()
  map.addControl(mapTypeControl, KakaoMap.ControlPosition.TOPRIGHT)

  const zoomControl = new KakaoMap.ZoomControl()
  map.addControl(zoomControl, KakaoMap.ControlPosition.RIGHT)

  map.addOverlayMapTypeId(KakaoMap.MapTypeId.USE_DISTRICT)

  MapItemDataSource.load()

  return map
}

export const MapUtil = {
  getKakaoMapLibrary,
  createKakaoMap,
}
