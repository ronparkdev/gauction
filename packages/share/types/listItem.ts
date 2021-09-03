export interface ListItem {
  editionNo: string // 사건번호
  productNo: string // 물번
  appraisedPrice: number // 감정가
  firstPrice: number // 시작 입찰가
  lowPrice: number // 최저 입찰가
  productType: string // 물건 타입 ex: 대지
  address: string // 주소
  groundSize: number // 토지 크기 (㎡)
  createdDate: number
  startDate: number
  endDate: number
  geo: {
    latitude: number
    longitude: number
  } | null
}
