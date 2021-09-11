import { atom } from 'recoil'

import { PRODUCT_TYPES } from 'service/types/productType'
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
        max: 300_000,
      }
    case 'lowPrice':
      return {
        min: 100,
        max: 100_000,
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

export const filterProductTypesState = atom<string[]>({
  key: 'filterProductTypesState',
  default: PRODUCT_TYPES,
})