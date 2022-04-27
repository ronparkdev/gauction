import { decode as iconvDecode } from 'iconv-lite'
import moment from 'moment'
import fetch from 'node-fetch'
import { xml2js, Element as XMLElement } from 'xml-js'

import { ListItem } from 'share/types/listItem'
import { SiType } from 'share/types/siType'
import { XMLUtils } from 'share/utils/xml'

import generateCommonHeader from '../commonHeader'
import { ListRawItem } from './listRawItem'

const ITEM_PER_PAGE = 30
const API_URL = 'http://goodauction.land.naver.com/auction/ax_list.php'
const API_REFERER = 'https://goodauction.land.naver.com/auction/ca_list.php'

const generateParams = (siType: SiType, startOffset: number) => ({
  class1: [2, 3, 9, 10, 11, 12, 33, 14, 7, 24, 34, 35, 36, 37, 40, 41, 42, 45, 46, 47, 48, 49, 50].join(','),
  ju_price1: '',
  ju_price2: '',
  bi_price1: '',
  bi_price2: '',
  num1: '',
  num2: '',
  lawsup: 0,
  lesson: 0,
  next_biddate1: '',
  next_biddate2: '',
  state: 91,
  b_count1: 0,
  b_count2: 0,
  b_area1: '',
  b_area2: '',
  special: 0,
  e_area1: '',
  e_area2: '',
  si: siType,
  gu: 0,
  dong: 0,
  apt_no: 0,
  order: '',
  start: startOffset,
  total_record_val: '',
  detail_search: '',
  detail_class: 1,
  recieveCode: '',
})

export const createListReceiver = (siType: SiType) => {
  let offset = 0

  return async () => {
    const params = generateParams(siType, offset)
    offset += ITEM_PER_PAGE

    const body = new URLSearchParams()

    Object.keys(params).forEach((key) => body.append(key, params[key]))

    const fetcher = () =>
      fetch(API_URL, {
        headers: generateCommonHeader(API_URL, API_REFERER),
        body: body,
        method: 'POST',
      })

    const items = await fetcher()
      .then((result) => result.buffer())
      .then((buffer) => iconvDecode(buffer, 'euc-kr'))
      .then((xmlText) => xml2js(xmlText))
      .then((element) => XMLUtils.getValueFromKey<XMLElement>(element as XMLElement, 'data'))
      .then((dataElement) => (dataElement.elements || []).map(XMLUtils.getJsonFromElement).filter((item) => !!item))
      .then((items) =>
        items.map((item: ListRawItem): ListItem => {
          const strToNum = (str) => Number(str.replace(/[^\d]/g, ''))
          const address = (/([^]*)(외[0-9]*필지)/g.exec(item.addr)?.[1] ?? item.addr).replace(',', '').trim()
          const groundSize = Number(/(토지)[^\d]*(([\d.]*)㎡)/g.exec(item.lbarea)?.[3] || 0)

          return {
            id: item.pid,
            editionNo: item.eno,
            productNo: item.pno,
            appraisedPrice: strToNum(item.jprice),
            address,
            lowPrice: strToNum(item.lprice),
            groundSize,
            productType: item.ptype,
            createdDate: new Date().getDate(),
            startDate: 0,
            endDate: moment(item.ndate, 'YYYY.MM.DD<BR>HH.mm').toDate().getTime(),
            imageUrl: null,
            geo: null,
          }
        }),
      )

    return {
      items,
      hasNext: items.length >= ITEM_PER_PAGE,
    }
  }
}
