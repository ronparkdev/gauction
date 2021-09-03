import axios from 'axios'
import qs from 'qs'

import { KakaoMapConstants } from 'share/constants/KakaoMap'

export const getGeo = async (address: string): Promise<{ latitude: number; longitude: number }> => {
  const params = { query: address, analyze_type: 'exact', page: 1, size: 1 }

  const result = await axios.get(
    `http://dapi.kakao.com/v2/local/search/address.json${qs.stringify(params, { addQueryPrefix: true })}`,
    { headers: { Authorization: `KakaoAK ${KakaoMapConstants.CRAWLER_REST_API_KEY}` } },
  )

  const [document] = result?.data?.documents

  if (!document) {
    return null
  }

  const { x, y } = document

  return { latitude: Number(y), longitude: Number(x) }
}
