/* eslint-disable no-unused-vars */
import * as UUID from 'uuid'

// import mapData from 'share/data/tank-20220410.json'
import { ListItem } from 'share/types/listItem'

import { FilterRangeState } from 'service/stores/atoms/filterState'

const mapData = (() => {
  const now = new Date()
  const dateStr = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map(String)
    .map((s) => s.padStart(2, '0'))
    .join('')

  return require(`share/data/tank-${dateStr}.json`) as ItemMap
})()

const MapItemWorker = require('./mapItem.worker.cjs').default

const sendMessage = (() => {
  if (typeof window.Worker === 'undefined') {
    // TODO: Add alternative code
    console.error('Web Worker is not supported')
    return async () => {}
  }

  const worker = new MapItemWorker()
  worker.onmessage = (event) => {
    const {
      data: { id, result, error },
    } = event

    if (error !== undefined) {
      handersMap[id]?.reject(error)
    } else {
      handersMap[id]?.resolve(result)
    }
    delete handersMap[id]
  }

  worker.onmessageerror = (event) => {
    console.error('Web Worker onmessageerror occured', event)
  }

  worker.onerror = (event) => {
    console.error('Web Worker onerror occured', event)
  }

  const handersMap: { [key in string]: { resolve: (value: any) => void; reject: (error: Error) => void } } = {}

  return async (type: string, request?: any) => {
    const id = UUID.v4()
    worker.postMessage({ type, id, request })
    return new Promise<any>((resolve, reject) => {
      handersMap[id] = { resolve, reject }
    })
  }
})()

type ItemMap = { [key in string]: ListItem }

const load = async () => await sendMessage('LOAD', mapData)

interface MapViewport {
  startLatitude: number
  endLatitude: number
  startLongitude: number
  endLongitude: number
}

interface ReadRequest {
  viewport: MapViewport
  filter: FilterRangeState
}

const read = async (request: ReadRequest): Promise<ListItem[]> => await sendMessage('READ', request)

const MapItemDataSource = {
  load,
  read,
}

export default MapItemDataSource
