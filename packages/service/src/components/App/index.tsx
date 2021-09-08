import React from 'react'

import Map from 'service/components/Map'
import pipeHOC from 'service/utils/hoc/pipeHOC'
import { styling, StylingProps } from 'service/utils/hoc/styling'

import Controller from '../Controller'

interface OwnProps extends StylingProps {}

const App = ({ cx }: OwnProps) => {
  return (
    <div className={cx('app')}>
      <div className={cx('map')}>
        <Map />
      </div>
      <div className={cx('controller')}>
        <Controller />
      </div>
    </div>
  )
}

export default pipeHOC(App, styling(require('./App.module.scss')))
