import React from 'react'
import ReactDOM from 'react-dom'
import { useRecoilState } from 'recoil'

import { selectedListItemState } from 'service/stores/atoms/select'

export const Tooltip = () => {
  const [selectedItem] = useRecoilState(selectedListItemState)

  if (!selectedItem) {
    return null
  }

  const modalRoot = document.getElementById(`map-info-${selectedItem.editionNo}`)
  if (!modalRoot) {
    return null
  }

  return ReactDOM.createPortal(<div>hello {JSON.stringify(selectedItem)}</div>, modalRoot)
}
