import React from 'react'

import pipeHOC from 'service/utils/hoc/pipeHOC'
import { StylingProps, styling } from 'service/utils/hoc/styling'

import CostRangeSlider from './RangeSlider'

interface OwnProps extends StylingProps {}

const Controller: React.FC<OwnProps> = ({ cx }: OwnProps) => {
  return (
    <div className={cx('root')}>
      <CostRangeSlider title={'감정 금액'} filterKey={'appraisedPrice'} stepSize={100} />
      <CostRangeSlider title={'현재 금액'} filterKey={'lowPrice'} stepSize={100} />
      <CostRangeSlider title={'평단가'} filterKey={'pricePerArea'} stepSize={10} />
    </div>
  )
}

export default pipeHOC(Controller, styling(require('./Controller.module.scss')))
