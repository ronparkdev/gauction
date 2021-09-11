import { Alignment, Switch } from '@blueprintjs/core'
import React from 'react'
import { useRecoilState } from 'recoil'

import { configSizeUnitState } from 'service/stores/atoms/configState'
import SizeUnit from 'service/types/sizeUnit'

export const SizeUnitSwitch = () => {
  const [sizeUnit, setSizeUnit] = useRecoilState(configSizeUnitState)

  return (
    <Switch
      alignIndicator={Alignment.RIGHT}
      innerLabel={SizeUnit.getName(sizeUnit)}
      onChange={() => {
        if (sizeUnit === SizeUnit.PYEONG) {
          setSizeUnit(SizeUnit.SQUARE_METTER)
        } else {
          setSizeUnit(SizeUnit.PYEONG)
        }
      }}
    />
  )
}
