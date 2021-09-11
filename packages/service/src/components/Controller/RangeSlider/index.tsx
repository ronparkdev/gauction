import { Label, RangeSlider as BPJRangeSlider } from '@blueprintjs/core'
import React, { ReactNode, useCallback, useMemo } from 'react'
import { useRecoilState } from 'recoil'

import { FilterRangeState, getDefaultFilterRange } from 'service/stores/atoms/filterState'
import { filterRangeStateSelector } from 'service/stores/selector/filterRangeStateSelector'
import pipeHOC from 'service/utils/hoc/pipeHOC'
import { styling, StylingProps } from 'service/utils/hoc/styling'
import { StringUtils } from 'service/utils/string'

interface OwnProps extends StylingProps {
  title: ReactNode
  titleRight?: ReactNode
  stepSize: number
  filterKey: keyof FilterRangeState
}

const RangeSlider = ({ cx, title, titleRight, stepSize, filterKey }: OwnProps) => {
  const [range, setRange] = useRecoilState(filterRangeStateSelector(filterKey))

  const rangeLimit = useMemo(() => getDefaultFilterRange(filterKey), [filterKey])

  const value: [number, number] = useMemo(() => {
    return [range.min, range.max <= rangeLimit.max ? range.max : rangeLimit.max + 1]
  }, [range, rangeLimit])

  const handleChangeValue = useCallback(
    ([min, max]) => {
      const adjustedMin = Math.max(rangeLimit.min, min - (min % stepSize))
      const adjustedMax =
        max > rangeLimit.max
          ? Number.MAX_SAFE_INTEGER
          : Math.max(rangeLimit.min, Math.min(rangeLimit.max, max - (max % stepSize)))

      setRange({
        min: adjustedMin,
        max: adjustedMax,
      })
    },
    [rangeLimit, stepSize, setRange],
  )

  return (
    <Label>
      <div className={cx('title')}>
        <div>{title}</div>
        <div>{titleRight}</div>
      </div>
      <BPJRangeSlider
        min={rangeLimit.min}
        max={rangeLimit.max + 1}
        labelRenderer={(value) => {
          if (rangeLimit.max < value) {
            return '∞'
          }
          return StringUtils.getReadablePrice(value)
        }}
        value={value}
        onChange={handleChangeValue}
        labelStepSize={rangeLimit.max - rangeLimit.min}
        stepSize={stepSize}
      />
    </Label>
  )
}

export default pipeHOC(RangeSlider, styling(require('./RangeSlider.module.scss')))
