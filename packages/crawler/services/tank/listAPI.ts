/* eslint-disable no-unused-vars */

import fetch from 'node-fetch'

import { ListItem } from 'share/types/listItem'
import { SiType } from 'share/types/siType'

import generateCommonHeader from '../commonHeader'

const ITEM_PER_PAGE = 30
const API_URL = 'https://www.tankauction.com/res/paSrchRslt.php'
const API_REFERER = 'https://www.tankauction.com/pa/paList.php'

export const createListReceiver = (siType: SiType) => {
  let page = 0

  return async () => {
    page += 1

    const body = new URLSearchParams()

    const fetcher = () =>
      fetch(`${API_URL}?pageNo=${page}&dataSize=${ITEM_PER_PAGE}&pageSize=10`, {
        headers: generateCommonHeader(API_URL, API_REFERER),
        body: body,
        method: 'POST',
      })

    const items = [] // await fetcher()
    // .then((result) => result.json())
    // .then((items) =>
    //   items.map((item: ListRawItem): ListItem => {
    //     const address = (/([^]*)(외[0-9]*필지)/g.exec(item.addr)?.[1] ?? item.addr).replace(',', '').trim()
    //     const firstPrice = Number(item.jprice.replace(/[^\d]/g, ''))
    //     const currentPrice = Number(item.lprice.replace(/[^\d]/g, ''))
    //     const groundSize = Number(/(토지)[^\d]*(([\d.]*)㎡)/g.exec(item.lbarea)?.[3] || 0)

    //     return {
    //       ...item,
    //       siType,
    //       address,
    //       firstPrice,
    //       currentPrice,
    //       groundSize,
    //     }
    //   }),
    // )

    return {
      items,
      hasNext: items.length >= ITEM_PER_PAGE,
    }
  }
}
