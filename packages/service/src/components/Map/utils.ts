/* eslint-disable no-unused-vars */
import mapRawData from 'share/data/20210831.json'
import { ListItem } from 'share/types/listItem'

import { FilterRangeState } from 'service/stores/atoms/filterState'

import { MapState } from './state'

const getKakaoMapLibrary = () => (window as any).kakao.maps

const getItemMap = (): { [key in string]: ListItem } => mapRawData

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

const getCachedInfoWindow = (() => {
  const itemMap = getItemMap()
  const infoWindowMap: { [key: string]: any } = {}

  const createCloseOverlayHandler = (key) => () => getCachedInfoWindow(key).close()

  return (key) => {
    const item = itemMap[key]
    const cachedInfoWindow = infoWindowMap[key]
    if (cachedInfoWindow) {
      return cachedInfoWindow
    }

    const KakaoMap = getKakaoMapLibrary()

    const content =
      '<div class="wrap">' +
      '    <div class="info">' +
      '        <div class="title">' +
      `            ${'테스트'}` +
      `            <div class="close" onclick="${createCloseOverlayHandler(key)}" title="닫기"></div>` +
      '        </div>' +
      '        <div class="body">' +
      '            <div class="img">' +
      '                <img src="https://cfile181.uf.daum.net/image/250649365602043421936D" width="73" height="70">' +
      '           </div>' +
      '            <div class="desc">' +
      `                <div class="ellipsis">${item.address}</div>` +
      '                <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div>' +
      '                <div><a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div>' +
      '            </div>' +
      '        </div>' +
      '    </div>' +
      '</div>'

    const infoWindow = new KakaoMap.InfoWindow({
      content,
    })

    infoWindowMap[key] = infoWindow

    return infoWindow
  }
})()

const createMarkerMap = (kakaoMap) => {
  const KakaoMap = getKakaoMapLibrary()
  const itemMap = getItemMap()
  const pinnedKeys = new Set<string>()

  return Object.keys(itemMap).reduce((map, key) => {
    const item = itemMap[key]

    if (!item || !item.geo || map[key]) {
      return map
    }

    const position = new KakaoMap.LatLng(item.geo.latitude, item.geo.longitude)

    const marker = new KakaoMap.Marker({
      position,
      clickable: true,
    })

    KakaoMap.event.addListener(marker, 'mouseover', () => {
      console.log(key, 'mouseover')
      getCachedInfoWindow(key).open(kakaoMap, marker)
    })
    KakaoMap.event.addListener(marker, 'mouseout', () => {
      console.log(key, 'mouseout')
      if (!pinnedKeys.has(key)) {
        getCachedInfoWindow(key).close()
      }
    })
    KakaoMap.event.addListener(marker, 'click', () => {
      if (pinnedKeys.has(key)) {
        pinnedKeys.delete(key)
      } else {
        pinnedKeys.add(key)
      }
    })

    map[key] = marker
    return map
  }, {})
}

const updateMarker = (() => {
  let cachedMarkerMap: { [key in string]: any }
  const itemMap = getItemMap()

  return (kakaoMap, filter: FilterRangeState) => {
    const markerMap = cachedMarkerMap || (() => (cachedMarkerMap = createMarkerMap(kakaoMap)))()

    const bounds = kakaoMap.getBounds()
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

      const pricePerArea = item.lowPrice / item.groundSize

      const isVisible =
        startLatitude <= item.geo.latitude &&
        endLatitude >= item.geo.latitude &&
        startLongitude <= item.geo.longitude &&
        endLongitude >= item.geo.longitude &&
        filter.appraisedPrice.min <= item.appraisedPrice / 10_000 &&
        filter.appraisedPrice.max >= item.appraisedPrice / 10_000 &&
        filter.lowPrice.min <= item.lowPrice / 10_000 &&
        filter.lowPrice.max >= item.lowPrice / 10_000 &&
        filter.pricePerArea.min <= pricePerArea / 10_000 &&
        filter.pricePerArea.max >= pricePerArea / 10_000

      marker.setMap(isVisible ? kakaoMap : null)
    })
  }
})()

export const MapUtils = {
  getKakaoMapLibrary,
  createKakaoMap,
  updateMarker,
}
