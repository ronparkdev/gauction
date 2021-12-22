/* eslint-disable no-unused-vars */
import { ListItem } from 'share/types/listItem'

import MapItemDataSource from 'service/datasources/mapItem'
import { FilterRangeState } from 'service/stores/atoms/filterState'

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

  MapItemDataSource.load()

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

const marker = (() => {
  const cachedMarkerMap = {}

  const getOrCreateMarker = (item: ListItem) => {
    const cached = cachedMarkerMap[item.editionNo]
    if (cached) {
      return cached
    }

    if (!item.geo) {
      return null
    }

    const KakaoMap = getKakaoMapLibrary()
    const position = new KakaoMap.LatLng(item.geo.latitude, item.geo.longitude)
    return (cachedMarkerMap[item.editionNo] = new KakaoMap.Marker({
      position,
      clickable: true,
    }))
  }

  const draw = (kakaoMap, itemOrKey: string | ListItem) => {
    if (typeof itemOrKey === 'string') {
      const key = itemOrKey
      return cachedMarkerMap[key] || null
    } else {
      const marker = getOrCreateMarker(itemOrKey)
      marker?.setMap(kakaoMap)
      return marker
    }
  }

  const clear = (excludeKeys: string[] = []) => {
    Object.keys(cachedMarkerMap)
      .filter((key) => !excludeKeys.includes(key))
      .map((key) => cachedMarkerMap[key])
      .forEach((marker) => marker.setMap(null))
  }

  const update = async (kakaoMap, filter: FilterRangeState) => {
    const bounds = kakaoMap.getBounds()

    const items = await MapItemDataSource.read({
      filter,
      viewport: {
        startLatitude: bounds.getSouthWest().getLat(),
        endLatitude: bounds.getNorthEast().getLat(),
        startLongitude: bounds.getSouthWest().getLng(),
        endLongitude: bounds.getNorthEast().getLng(),
      },
    })

    items.forEach((item) => draw(kakaoMap, item))
    clear(items.map((item) => item.editionNo))
  }

  return {
    draw,
    clear,
    update,
  }
})()

export const MapUtils = {
  getKakaoMapLibrary,
  createKakaoMap,
  updateMarker: marker.update,
}
