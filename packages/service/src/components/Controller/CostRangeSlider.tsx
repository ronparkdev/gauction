import { Label, RangeSlider } from '@blueprintjs/core'
import React, { useState } from 'react'

interface OwnProps {
  min: number
  max: number
  title?: string
  valueKey?: string
}

const withComma = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

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
            return `${withComma(quotient)}억${remainder > 0 ? ` ${withComma(remainder)}` : ''}`
          }
          return `${withComma(remainder)}`
        }}
        value={cost}
        onChange={setCost}
        labelStepSize={max - min}
        stepSize={100}
      />
    </Label>
  )
}
