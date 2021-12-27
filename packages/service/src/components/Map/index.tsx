import throttle from 'lodash/throttle'
import React, { useCallback, useEffect, useRef } from 'react'
import scriptLoader, { ScriptLoaderProps } from 'react-script-loader-hoc'
import { useRecoilState } from 'recoil'

import { KakaoMapConstants } from 'share/constants/KakaoMap'

import { FilterRangeState, filterRangeState } from 'service/stores/atoms/filterState'
import pipeHOC from 'service/utils/hoc/pipeHOC'
import { styling, StylingProps } from 'service/utils/hoc/styling'

import { MapUtil } from './mapUtil'
import { useMapMarker } from './markerHook'
import { MapState } from './state'
import { Tooltip } from './Tooltip'

interface OwnProps extends ScriptLoaderProps, StylingProps {}

const Map: React.FC<OwnProps> = ({ cx, scriptsLoadedSuccessfully }: OwnProps) => {
  const [filter] = useRecoilState(filterRangeState)

  const filterRef = useRef<FilterRangeState>(filter)
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  const { updateMarker } = useMapMarker(mapRef)

  const writeStateWithThrottle = useCallback(() => {
    const map = mapRef.current
    if (map) {
      const state = {
        latitude: map.getCenter().getLat(),
        longitude: map.getCenter().getLng(),
        level: map.getLevel(),
      }
      MapState.write(state)
    }
  }, [mapRef])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateMarkerWithThrottle = useCallback(
    throttle(() => {
      updateMarker(filterRef.current)
    }, 100),
    [updateMarker],
  )

  useEffect(() => {
    filterRef.current = filter
    updateMarkerWithThrottle()
  }, [filter, updateMarkerWithThrottle])

  useEffect(() => {
    const container = ref.current
    if (container && scriptsLoadedSuccessfully) {
      MapUtil.getKakaoMapLibrary().load()

      const timerId = setTimeout(() => {
        const map = MapUtil.createKakaoMap(container)
        mapRef.current = map

        const KakaoMap = MapUtil.getKakaoMapLibrary()
        KakaoMap.event.addListener(map, 'center_changed', function () {
          writeStateWithThrottle()
        })
        KakaoMap.event.addListener(map, 'zoom_changed', function () {
          writeStateWithThrottle()
        })
        KakaoMap.event.addListener(map, 'bounds_changed', function () {
          updateMarkerWithThrottle()
        })

        updateMarkerWithThrottle()
      }, 100)

      return () => clearTimeout(timerId)
    }
  }, [ref, mapRef, scriptsLoadedSuccessfully, writeStateWithThrottle, updateMarkerWithThrottle])

  return (
    <>
      <div className={cx('map')} ref={ref} />
      <Tooltip />
    </>
  )
}

export default pipeHOC(
  Map,
  scriptLoader(
    `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KakaoMapConstants.SERVICE_MAP_KEY}&libraries=services&autoload=false`,
  ),
  styling(require('./Map.module.scss')),
)
