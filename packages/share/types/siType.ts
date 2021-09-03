/* eslint-disable no-unused-vars */

export enum SiType {
  서울 = 11,
  부산 = 26,
  대구 = 27,
  인천 = 28,
  광주 = 29,
  대전 = 30,
  울산 = 31,
  세종 = 36,
  경기 = 41,
  강원 = 42,
  충북 = 43,
  충남 = 44,
  전북 = 45,
  전남 = 46,
  경북 = 47,
  경남 = 48,
  제주 = 50,
}

export namespace SiType {
  export const keys = [
    SiType.서울,
    SiType.부산,
    SiType.대구,
    SiType.인천,
    SiType.광주,
    SiType.대전,
    SiType.울산,
    SiType.세종,
    SiType.경기,
    SiType.강원,
    SiType.충북,
    SiType.충남,
    SiType.전북,
    SiType.전남,
    SiType.경북,
    SiType.경남,
    SiType.제주,
  ]

  export const getName = (siType: SiType) => {
    switch (siType) {
      case SiType.서울:
        return '서울'
      case SiType.부산:
        return '부산'
      case SiType.대구:
        return '대구'
      case SiType.인천:
        return '인천'
      case SiType.광주:
        return '광주'
      case SiType.대전:
        return '대전'
      case SiType.울산:
        return '울산'
      case SiType.세종:
        return '세종'
      case SiType.경기:
        return '경기'
      case SiType.강원:
        return '강원'
      case SiType.충북:
        return '충북'
      case SiType.충남:
        return '충남'
      case SiType.전북:
        return '전북'
      case SiType.전남:
        return '전남'
      case SiType.경북:
        return '경북'
      case SiType.경남:
        return '경남'
      case SiType.제주:
        return '제주'
    }
  }
}
