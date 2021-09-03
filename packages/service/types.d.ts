declare module 'react-script-loader-hoc' {
  import React from 'react'

  export interface ScriptLoaderProps {
    scriptsLoaded: boolean
    scriptsLoadedSuccessfully: boolean
  }

  const scriptLoader: (
    ...scriptSrcs: string[]
  ) => <P extends ScriptLoaderProps>(
    Component: React.ComponentType<P>,
  ) => React.ComponentType<Omit<P, keyof ScriptLoaderProps>>

  export default scriptLoader
}
