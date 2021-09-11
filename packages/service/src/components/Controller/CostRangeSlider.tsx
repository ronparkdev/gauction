import { Label, RangeSlider } from '@blueprintjs/core'
import React, { useCallback, useMemo } from 'react'
import { useRecoilState } from 'recoil'

import { FilterRangeState, getDefaultFilterRange } from 'service/stores/atoms/filterState'
import { filterRangeStateSelector } from 'service/stores/selector/filterRangeStateSelector'
import { StringUtils } from 'service/utils/string'

interface OwnProps {
  title: string
  stepSize: number
  filterKey: keyof FilterRangeState
}

type Props = OwnProps

const CostRangeSlider: React.FC<Props> = ({ title, stepSize, filterKey }: Props) => {
  const [range, setRange] = useRecoilState(filterRangeStateSelector(filterKey))

  const rangeLimit = useMemo(() => getDefaultFilterRange(filterKey), [filterKey])

  const value: [number, number] = useMemo(() => {
    return [range.min, range.max <= rangeLimit.max ? range.max : rangeLimit.max + 1]
  }, [range, rangeLimit])

  const handleChangeValue = useCallback(
    ([min, max]) => {
      setRange({ min, max: max <= rangeLimit.max ? max : Number.MAX_SAFE_INTEGER })
    },
    [rangeLimit, setRange],
  )

  return (
    <Label>
      {title}
      <RangeSlider
        min={rangeLimit.min}
        max={rangeLimit.max + 1}
        labelRenderer={(value) => {
          if (rangeLimit.max < value) {
            return '∞'
          }
          const quotient = Math.floor(value / 10_000)
          const remainder = value % 10_000
          if (quotient > 0) {
            return `${StringUtils.withComma(quotient)}억${remainder > 0 ? ` ${StringUtils.withComma(remainder)}` : ''}`
          }
          return `${StringUtils.withComma(remainder)}`
        }}
        value={value}
        onChange={handleChangeValue}
        labelStepSize={rangeLimit.max - rangeLimit.min}
        stepSize={stepSize}
      />
    </Label>
  )
}

export default CostRangeSlider
