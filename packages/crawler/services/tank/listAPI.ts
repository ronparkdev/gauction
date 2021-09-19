/* eslint-disable no-unused-vars */

import moment from 'moment'
import fetch from 'node-fetch'

import { ListItem } from 'share/types/listItem'

import generateCommonHeader from '../commonHeader'
import { ListRawItem } from './listRawItem'

const ITEM_PER_PAGE = 100
const API_URL = 'https://www.tankauction.com/res/paSrchRslt.php'
const API_REFERER = 'https://www.tankauction.com/pa/paList.php'

const generateParams = () => ({
  siCd: 0,
  guCd: 0,
  dnCd: 0,
  cmgmtNo: '',
  bgnDt: '',
  clsDt: '',
  orgDvsn: 2,
  dpslCd: 1,
  cat1: 0,
  cat2: 0,
  apslAmtBgn: 0,
  apslAmtEnd: 0,
  stat: 1,
  minbAmtBgn: 0,
  minbAmtEnd: 0,
  prptDvsn: 0,
  landSqmBgn: '',
  landSqmEnd: '',
  rdctRate: 0,
  bldgSqmBgn: '',
  bldgSqmEnd: '',
  splSrchType: 0,
  dataSize: ITEM_PER_PAGE,
  lsType: 0,
  odrCol: 0,
  odrAds: 0,
  chkSplCdtn: '',
  payChk: '',
})

export const createListReceiver = () => {
  let page = 0

  return async () => {
    page += 1

    const params = generateParams()

    const body = new URLSearchParams()

    Object.keys(params).forEach((key) => body.append(key, params[key]))

    const fetcher = () =>
      fetch(`${API_URL}?pageNo=${page}&dataSize=${ITEM_PER_PAGE}&pageSize=${ITEM_PER_PAGE}`, {
        headers: generateCommonHeader(API_URL, API_REFERER),
        body: body,
        method: 'POST',
      })

    const strToNum = (str: string) => parseInt(str.replace(/[^\d]/g, ''), 10)
    const strToDate = (str: string) => moment(str, 'MM-DD HH:mm').toDate().getTime()

    const items = await fetcher()
      .then((result) => result.json())
      .then((json) =>
        json.item.map((item: ListRawItem): ListItem => {
          return {
            editionNo: item.mgmtNo,
            productNo: '',
            appraisedPrice: strToNum(item.apslAmt),
            lowPrice: strToNum(item.minbAmt),
            productType: item.ctgr,
            address: item.cltrNm,
            createdDate: new Date().getTime(),
            startDate: strToDate(item.bgnDtm),
            endDate: strToDate(item.clsDtm),
            groundSize: item.landSqm,
            imageUrl: item.imgUrl,
            geo: null,
          }
        }),
      )

    console.log('l', items.length)

    return {
      items,
      hasNext: items.length >= ITEM_PER_PAGE,
    }
  }
}
