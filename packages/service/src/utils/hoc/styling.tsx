import { Argument } from 'classnames'
import classnames from 'classnames/bind'
import React from 'react'

export interface StylingProps {
  cx: (...args: Argument[]) => string
}

export const styling = (styles) => {
  const cx = classnames.bind(styles)
  return <P extends StylingProps>(
      ComposedComponent: React.ComponentType<P>,
    ): React.ComponentType<Omit<P, keyof StylingProps>> =>
    (props: Omit<P, keyof StylingProps>) => {
      const newProps = { ...props, cx } as P
      return <ComposedComponent {...newProps} />
    }
}
