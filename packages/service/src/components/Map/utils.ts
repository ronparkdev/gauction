/* eslint-disable no-unused-vars */
import mapRawData from 'share/data/20210831.json'
import { ListItem } from 'share/types/listItem'

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

  return map
}

const updateMarker = (() => {
  let isInitialized = false
  const itemMap: { [key in string]: ListItem } = mapRawData
  const markerMap: { [key in string]: any } = {}

  return (map) => {
    if (!isInitialized) {
      const KakaoMap = getKakaoMapLibrary()

      Object.keys(itemMap).forEach((key) => {
        const item = itemMap[key]

        if (!item || !item.geo || markerMap[key]) {
          console.error('no item', key)
          return
        }

        const position = new KakaoMap.LatLng(item.geo.latitude, item.geo.longitude)

        const marker = new KakaoMap.Marker({
          position,
          clickable: true,
        })

        markerMap[key] = marker
      })

      isInitialized = true
    }
    const bounds = map.getBounds()
    const swLatLng = bounds.getSouthWest()
    const neLatLng = bounds.getNorthEast()

    const startLatitude = swLatLng.getLat()
    const endLatitude = neLatLng.getLat()

    const startLongitude = swLatLng.getLng()
    const endLongitude = neLatLng.getLng()

    Object.keys(itemMap).forEach((key) => {
      const item = itemMap[key]
      const marker = markerMap[key]
      if (!item || !item.geo || !marker) {
        return
      }

      const isVisible =
        startLatitude <= item.geo.latitude &&
        item.geo.latitude <= endLatitude &&
        startLongitude <= item.geo.longitude &&
        item.geo.longitude <= endLongitude

      marker.setMap(isVisible ? map : null)
    })
  }
})()

export const MapUtils = {
  getKakaoMapLibrary,
  createKakaoMap,
  updateMarker,
}