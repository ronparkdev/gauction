export interface ListItem {
  id?: string //
  editionNo: string // 사건번호
  productNo: string // 물번
  appraisedPrice: number | null // 감정가
  lowPrice: number // 최저 입찰가
  productType: string // 물건 타입 ex: 대지
  address: string // 주소
  groundSize: number // 대지권 (㎡)
  buildingSize: number // 건물면젹 (㎡)
  createdDate: number // 최초 등록일
  startDate: number // 시작일
  endDate: number // 종료일
  imageUrl: string | null
  geo: {
    latitude: number
    longitude: number
  } | null
}
