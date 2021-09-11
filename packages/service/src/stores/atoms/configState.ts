import { atom } from 'recoil'

import SizeUnit from 'service/types/sizeUnit'

export const configSizeUnitState = atom<SizeUnit>({
  key: 'configSizeUnitState',
  default: SizeUnit.PYEONG,
})
