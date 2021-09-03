import throttle from 'lodash/throttle'
import React, { useCallback, useEffect, useRef } from 'react'
import scriptLoader, { ScriptLoaderProps } from 'react-script-loader-hoc'

import { KakaoMapConstants } from 'share/constants/KakaoMap'

import pipeHOC from 'service/utils/hoc/pipeHOC'
import { styling, StylingProps } from 'service/utils/hoc/styling'

import { MapState } from './state'
import { MapUtils } from './utils'

interface OwnProps extends ScriptLoaderProps, StylingProps {}

const Map: React.FC<OwnProps> = ({ cx, scriptsLoadedSuccessfully }: OwnProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  const writeStateWithThrottle = useCallback(
    throttle(() => {
      const map = mapRef.current
      if (map) {
        const state = {
          latitude: map.getCenter().getLat(),
          longitude: map.getCenter().getLng(),
          level: map.getLevel(),
        }
        MapState.write(state)
      }
    }, 300),
    [mapRef],
  )

  const updateMarkerWithThrottle = useCallback(
    throttle(() => {
      const map = mapRef.current
      if (map) {
        MapUtils.updateMarker(map)
      }
    }, 500),
    [mapRef],
  )

  useEffect(() => {
    const container = ref.current
    if (container && scriptsLoadedSuccessfully) {
      MapUtils.getKakaoMapLibrary().load()

      const timerId = setTimeout(() => {
        const map = MapUtils.createKakaoMap(container)
        mapRef.current = map

        const KakaoMap = MapUtils.getKakaoMapLibrary()
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

  return <div className={cx('map')} ref={ref} />
}

export default pipeHOC(
  Map,
  scriptLoader(
    `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KakaoMapConstants.SERVICE_MAP_KEY}&libraries=services&autoload=false`,
  ),
  styling(require('./Map.scss')),
)
