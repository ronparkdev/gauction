/*
apslAmt: "3,382,405"
bgnDtm: "11-15 10:00"
bldgPyng: 0
bldgSqm: 0
clsDtm: "11-17 17:00"
cltrNm: "충청남도 아산시 음봉면 월랑리 6-4"
cltrNo: 1544782
ctgr: "도로"
dpslMtd: "매각"
imgUrl: ""
landPyng: 12.037
landSqm: 39.793
mgmtNo: "2021-07417-007"
minbAmt: "3,383,000"
rdctRate: "(100%)"
splCdtn: ""
statNm: "입찰준비중"
*/

export interface ListRawItem {
  apslAmt: string // 감정가
  bgnDtm: string // 입찰 시작
  clsDtm: string // 입찰 마감
  cltrNm: string // 주소
  ctgr: string // 유형
  dpslMtd: string // ?
  imgUrl: string // 이미지 주소
  landPyng: number // 평
  landSqm: number // 제곱미터
  mgmtNo: string // 사건번호
  minbAmt: string // 현재가
  rdctRate: string // 최소금액비율
  statNm: string // 상태
}
