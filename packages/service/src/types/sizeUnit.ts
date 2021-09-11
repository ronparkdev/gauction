/* eslint-disable no-unused-vars */

enum SizeUnit {
  SQUARE_METTER = 'SQUARE_METTER',
  PYEONG = 'PYEONG',
}

namespace SizeUnit {
  export const getName = (sizeUnit: string | SizeUnit) => {
    switch (sizeUnit) {
      case SizeUnit.SQUARE_METTER:
        return '㎡'
      case SizeUnit.PYEONG:
        return '평'
    }
  }
}

export default SizeUnit
