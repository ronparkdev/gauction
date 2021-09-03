import React from 'react'

import pipeHOC from 'service/utils/hoc/pipeHOC'
import { StylingProps, styling } from 'service/utils/hoc/styling'

interface OwnProps extends StylingProps {}

const Controller: React.FC<OwnProps> = ({ cx }: OwnProps) => {
  return <div className={cx('root')} />
}

export default pipeHOC(Controller, styling(require('./Map.scss')))
