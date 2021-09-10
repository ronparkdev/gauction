import React from 'react'

import pipeHOC from 'service/utils/hoc/pipeHOC'
import { StylingProps, styling } from 'service/utils/hoc/styling'

import CostRangeSlider from './CostRangeSlider'

interface OwnProps extends StylingProps {}

const Controller: React.FC<OwnProps> = ({ cx }: OwnProps) => {
  return (
    <div className={cx('root')}>
      <CostRangeSlider title={'현재 금액'} filterKey={'currentPrice'} />
      <CostRangeSlider title={'평단가'} filterKey={'pricePerArea'} />
    </div>
  )
}

export default pipeHOC(Controller, styling(require('./Controller.module.scss')))
