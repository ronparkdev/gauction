/* eslint-disable no-unused-vars */
import { useCallback, useRef } from 'react'
import { useSetRecoilState } from 'recoil'

import { ListItem } from 'share/types/listItem'

import MapItemDataSource from 'service/datasources/mapItem'
import { FilterState } from 'service/stores/atoms/filterState'
import { selectedListItemState } from 'service/stores/atoms/select'

import { MapUtil } from './mapUtil'

export const useMapMarker = (kakaoMapRef: React.MutableRefObject<any>) => {
  const infoWindowMapRef = useRef<{ [key in string]: any }>({})
  const markerMapRef = useRef<{ [key in string]: any }>({})
  const setSelectedListItem = useSetRecoilState(selectedListItemState)

  const createInfoWindow = useCallback((key: string) => {
    const KakaoMap = MapUtil.getKakaoMapLibrary()
    return (infoWindowMapRef.current[key] = new KakaoMap.InfoWindow({
      content: `<div id="map-info-${key}" />`,
    }))
  }, [])

  const getOrCreateInfoWindow = useCallback(
    (key: string) => infoWindowMapRef.current[key] || createInfoWindow(key),
    [createInfoWindow],
  )

  const createMarker = useCallback(
    (item: ListItem) => {
      if (!item.geo) {
        return null
      }

      const KakaoMap = MapUtil.getKakaoMapLibrary()
      const position = new KakaoMap.LatLng(item.geo.latitude, item.geo.longitude)
      const marker = new KakaoMap.Marker({
        position,
        clickable: true,
      })

      KakaoMap.event.addListener(marker, 'mouseover', () => {
        getOrCreateInfoWindow(item.editionNo).open(kakaoMapRef.current, marker)
        setSelectedListItem(item)
      })

      // 마커에 마우스아웃 이벤트를 등록합니다
      KakaoMap.event.addListener(marker, 'mouseout', () => {
        getOrCreateInfoWindow(item.editionNo).close()
        setSelectedListItem((oldItem) => (oldItem?.editionNo === item.editionNo ? null : oldItem))
      })

      KakaoMap.event.addListener(marker, 'click', () => {
        window.open(`https://auction1.land.naver.com/auction/ca_view.php?product_id=${item.id}`)
      })

      markerMapRef.current[item.editionNo] = marker

      return marker
    },
    [kakaoMapRef, getOrCreateInfoWindow, setSelectedListItem],
  )

  const updateMarker = useCallback(
    async (filter: FilterState) => {
      const kakaoMap = kakaoMapRef.current
      if (!kakaoMap) {
        return
      }

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

      items.forEach((item) => {
        const marker = markerMapRef.current[item.editionNo] || createMarker(item)
        marker?.setMap(kakaoMap)
      })

      const excludeKeys = items.map((item) => item.editionNo)

      Object.keys(markerMapRef.current)
        .filter((key) => !excludeKeys.includes(key))
        .map((key) => markerMapRef.current[key])
        .forEach((marker) => marker.setMap(null))
    },
    [kakaoMapRef, createMarker],
  )

  return {
    updateMarker,
  }
}
