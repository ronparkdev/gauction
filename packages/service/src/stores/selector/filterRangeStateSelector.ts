import { DefaultValue, RecoilState, selector } from 'recoil'

import { FilterRangeState, filterState } from 'service/stores/atoms/filterState'
import { Range } from 'service/types/range'

export const filterRangeStateSelector = (() => {
  const selectorMap: { [_: string]: RecoilState<Range> } = {}
  return (filterKey: keyof FilterRangeState) => {
    const sel =
      selectorMap[filterKey] ||
      selector<Range>({
        key: `selectedFilterState_${filterKey}`,
        get: ({ get }) => get(filterState)[filterKey],
        set: ({ set, get }, newValue) => {
          if (!(newValue instanceof DefaultValue)) {
            set(filterState, { ...get(filterState), [filterKey]: newValue })
          }
        },
      })
    selectorMap[filterKey] = sel
    return sel
  }
})()
