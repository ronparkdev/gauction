import React from 'react'
import ReactDOM from 'react-dom'

interface Props {
  targetKey: string
}

export const Tooltip: React.FC<Props> = ({ targetKey }: Props) => {
  const modalRoot = document.getElementById(`map-info-${targetKey}`)
  if (!modalRoot) {
    return null
  }

  return ReactDOM.createPortal(<div>hello {targetKey}</div>, modalRoot)
}
