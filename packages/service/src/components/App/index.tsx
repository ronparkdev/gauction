import React from 'react'

import Map from 'service/components/Map'
import pipeHOC from 'service/utils/hoc/pipeHOC'
import { styling, StylingProps } from 'service/utils/hoc/styling'

interface OwnProps extends StylingProps {}

const App = ({ cx }: OwnProps) => {
  return (
    <div className={cx('app')}>
      <div className={cx('map')}>
        <Map />
      </div>
      <div className={cx('controller')}></div>
    </div>
  )
}

export default pipeHOC(App, styling(require('./App.scss')))
