import { decode as iconvDecode } from 'iconv-lite'
import moment from 'moment'
import fetch from 'node-fetch'
import { xml2js, Element as XMLElement } from 'xml-js'

import { ListItem } from 'share/types/listItem'
import { SiType } from 'share/types/siType'
import { XMLUtils } from 'share/utils/xml'

import generateCommonHeader from '../commonHeader'

const ITEM_PER_PAGE = 30
const API_URL = 'http://goodauction.land.naver.com/auction/ax_list.php'
const API_REFERER = 'https://goodauction.land.naver.com/auction/ca_list.php'

/*
<pid > 2243001 </pid > 
<eno > 21-907 </eno > 
<pno > 2 </pno > 
<jprice > 25,026,000 </jprice > 
<lprice > 17,518,000 </lprice > 
<sprice > 0 </sprice > 
<ptype > 농지 </ptype > 
<addr > 광주광역시 광산구 대산동 146, </addr > 
<lbarea > <p><span>토지 <em>291㎡</em></span></p> </lbarea > 
<stype > <p>유찰1회</p><p class='num_type2'>70%</p> </stype > 
<ndate > 2021.08.17<BR>10:00 </ndate >
*/

interface ListRawItem {
  pid: string // 상품번호 -> KEY
  eno: string // 사건번호
  pno: string // 물번
  jprice: string // 감정가
  lprice: string // 최저 입찰가
  sprice: string // ?
  ptype: string // 물건 타입 ex: 대지
  addr: string // Raw 주소
  lbarea: string
  stype: string
  ndate: string
}

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
            editionNo: item.eno,
            productNo: item.pno,
            appraisedPrice: strToNum(item.jprice),
            address,
            lowPrice: strToNum(item.lprice),
            groundSize,
            productType: item.ptype,
            createdDate: new Date().getDate(),
            firstPrice: 0,
            startDate: 0,
            endDate: moment(item.ndate, 'YYYY.MM.DD<BR>HH.mm').toDate().getTime(),
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
