import { atom } from 'recoil'

import { PRODUCT_TYPES } from 'service/types/productType'
import { Range } from 'service/types/range'
import { localForageEffect } from 'service/utils/recoil-effect/localForage'

export type FilterState = FilterRangeState & {
  productTypes: string[]
}

export interface FilterRangeState {
  appraisedPriceRange: Range
  lowPriceRange: Range
  pricePerAreaRange: Range
}

export const getDefaultFilterRange = (filterKey: keyof FilterRangeState): Range => {
  switch (filterKey) {
    case 'appraisedPriceRange':
      return {
        min: 100,
        max: 300_000,
      }
    case 'lowPriceRange':
      return {
        min: 100,
        max: 100_000,
      }
    case 'pricePerAreaRange':
      return {
        min: 1,
        max: 200,
      }
  }
}

export const filterState = atom<FilterState>({
  key: 'filterState',
  default: {
    appraisedPriceRange: getDefaultFilterRange('appraisedPriceRange'),
    lowPriceRange: getDefaultFilterRange('lowPriceRange'),
    pricePerAreaRange: getDefaultFilterRange('pricePerAreaRange'),
    productTypes: PRODUCT_TYPES,
  },
  effects_UNSTABLE: [localForageEffect('filterState')],
})
