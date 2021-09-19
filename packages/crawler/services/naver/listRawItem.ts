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

export interface ListRawItem {
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
