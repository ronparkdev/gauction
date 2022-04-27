import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useRecoilState, useRecoilValue } from 'recoil'

import { configSizeUnitState } from 'service/stores/atoms/configState'
import { selectedListItemState } from 'service/stores/atoms/select'
import SizeUnit from 'service/types/sizeUnit'
import { StringUtils } from 'service/utils/string'

export const Tooltip = () => {
  const [selectedItem] = useRecoilState(selectedListItemState)
  const sizeUnit = useRecoilValue(configSizeUnitState)

  const tableData = useMemo(() => {
    if (!selectedItem) {
      return null
    }

    const appraisedPrice = selectedItem.appraisedPrice && StringUtils.getReadablePrice(selectedItem.appraisedPrice)
    const lowPrice = StringUtils.getReadablePrice(selectedItem.lowPrice)
    const percentOfAppraisedPrice =
      selectedItem.appraisedPrice && `(${Math.floor((selectedItem.lowPrice / selectedItem.appraisedPrice) * 100)}%)`
    const groundSize = `${Math.floor(SizeUnit.convert(sizeUnit, selectedItem.groundSize))}${SizeUnit.getName(sizeUnit)}`
    const pricePerGroundSize = StringUtils.getReadablePrice(
      Math.floor(selectedItem.lowPrice / SizeUnit.convert(sizeUnit, selectedItem.groundSize)),
    )

    return {
      감정가: appraisedPrice,
      현재가: [lowPrice, percentOfAppraisedPrice].filter((str) => !!str).join(' '),
      토지크기: groundSize,
      [`${SizeUnit.getName(sizeUnit)}단가`]: pricePerGroundSize,
      // RAW: JSON.stringify(selectedItem),
    }
  }, [selectedItem, sizeUnit])

  if (!selectedItem || !tableData) {
    return null
  }

  const modalRoot = document.getElementById(`map-info-${selectedItem.editionNo}`)
  if (!modalRoot) {
    return null
  }

  return ReactDOM.createPortal(
    <div style={{ position: 'absolute', bottom: -20, background: 'white', width: 300 }}>
      <table>
        {Object.keys(tableData).map((key) => {
          const value = tableData[key]
          return (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          )
        })}
      </table>
    </div>,
    modalRoot,
  )
}
