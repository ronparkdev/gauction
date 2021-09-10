import { DefaultValue, selector } from 'recoil'

import { filterRangeState, FilterRangeState } from 'service/stores/atoms/filterState'
import { Range } from 'service/types/range'

export const filterRangeStateSelector = (filterKey: keyof FilterRangeState) =>
  selector<Range>({
    key: `selectedFilterRangeState_${filterKey}`,
    get: ({ get }) => get(filterRangeState)[filterKey],
    set: ({ set, get }, newValue) => {
      if (!(newValue instanceof DefaultValue)) {
        set(filterRangeState, { ...get(filterRangeState), [filterKey]: newValue })
      }
    },
  })
