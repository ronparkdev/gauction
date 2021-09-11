import { atom } from 'recoil'

import { Range } from 'service/types/range'

export interface FilterRangeState {
  appraisedPrice: Range
  lowPrice: Range
  pricePerArea: Range
}

export const getDefaultFilterRange = (filterKey: keyof FilterRangeState): Range => {
  switch (filterKey) {
    case 'appraisedPrice':
      return {
        min: 100,
        max: 1_000_000,
      }
    case 'lowPrice':
      return {
        min: 100,
        max: 500_000,
      }
    case 'pricePerArea':
      return {
        min: 1,
        max: 1_000,
      }
  }
}

export const filterRangeState = atom<FilterRangeState>({
  key: 'filterRangeState',
  default: {
    appraisedPrice: getDefaultFilterRange('appraisedPrice'),
    lowPrice: getDefaultFilterRange('lowPrice'),
    pricePerArea: getDefaultFilterRange('pricePerArea'),
  },
})
