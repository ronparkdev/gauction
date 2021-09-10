import { atom } from 'recoil'

import { Range } from 'service/types/range'

export interface FilterRangeState {
  currentPrice: Range
  pricePerArea: Range
}

export const getDefaultFilterRange = (filterKey: keyof FilterRangeState): Range => {
  switch (filterKey) {
    case 'currentPrice':
      return {
        min: 100,
        max: 1_000_000,
      }
    case 'pricePerArea':
      return {
        min: 100,
        max: 100_000,
      }
  }
}

export const filterRangeState = atom<FilterRangeState>({
  key: 'filterRangeState',
  default: {
    currentPrice: getDefaultFilterRange('currentPrice'),
    pricePerArea: getDefaultFilterRange('pricePerArea'),
  },
})
