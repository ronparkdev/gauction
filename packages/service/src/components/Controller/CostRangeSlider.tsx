import { Label, RangeSlider } from '@blueprintjs/core'
import React, { useState } from 'react'

import { StringUtils } from 'service/utils/string'

interface OwnProps {
  min: number
  max: number
  title?: string
  valueKey?: string
}

export const CostRangeSlider: React.FC<OwnProps> = ({ title, min, max }: OwnProps) => {
  const [cost, setCost] = useState<[number, number]>([min, max + 1])

  return (
    <Label>
      {title}
      <RangeSlider
        min={min}
        max={max + 1}
        labelRenderer={(value) => {
          if (max < value) {
            return '∞'
          }
          const quotient = Math.floor(value / 10_000)
          const remainder = value % 10_000
          if (quotient > 0) {
            return `${StringUtils.withComma(quotient)}억${remainder > 0 ? ` ${StringUtils.withComma(remainder)}` : ''}`
          }
          return `${StringUtils.withComma(remainder)}`
        }}
        value={cost}
        onChange={setCost}
        labelStepSize={max - min}
        stepSize={100}
      />
    </Label>
  )
}
