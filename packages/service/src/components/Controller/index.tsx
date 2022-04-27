import React from 'react'
import { useRecoilValue } from 'recoil'

import { configSizeUnitState } from 'service/stores/atoms/configState'
import SizeUnit from 'service/types/sizeUnit'
import pipeHOC from 'service/utils/hoc/pipeHOC'
import { StylingProps, styling } from 'service/utils/hoc/styling'

import ProductTypeSelector from './ProductTypeSelector'
import CostRangeSlider from './RangeSlider'
import SizeUnitSwitch from './SizeUnitSwitch'

interface OwnProps extends StylingProps {}

const Controller: React.FC<OwnProps> = ({ cx }: OwnProps) => {
  const sizeUnit = useRecoilValue(configSizeUnitState)

  return (
    <div className={cx('root')}>
      <CostRangeSlider title={'감정 금액'} filterKey={'appraisedPriceRange'} stepSize={100} />
      <CostRangeSlider title={'현재 금액'} filterKey={'lowPriceRange'} stepSize={100} />
      <CostRangeSlider
        title={`${SizeUnit.getName(sizeUnit)}당 단가`}
        filterKey={'pricePerAreaRange'}
        stepSize={1}
        titleRight={<SizeUnitSwitch />}
      />
      <ProductTypeSelector />
    </div>
  )
}

export default pipeHOC(Controller, styling(require('./Controller.module.scss')))
