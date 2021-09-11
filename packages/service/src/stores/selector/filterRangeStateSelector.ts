import { DefaultValue, RecoilState, selector } from 'recoil'

import { filterRangeState, FilterRangeState } from 'service/stores/atoms/filterState'
import { Range } from 'service/types/range'

export const filterRangeStateSelector = (() => {
  const selectorMap: { [_: string]: RecoilState<Range> } = {}
  return (filterKey: keyof FilterRangeState) => {
    const sel =
      selectorMap[filterKey] ||
      selector<Range>({
        key: `selectedFilterRangeState_${filterKey}`,
        get: ({ get }) => get(filterRangeState)[filterKey],
        set: ({ set, get }, newValue) => {
          if (!(newValue instanceof DefaultValue)) {
            set(filterRangeState, { ...get(filterRangeState), [filterKey]: newValue })
          }
        },
      })
    selectorMap[filterKey] = sel
    return sel
  }
})()
