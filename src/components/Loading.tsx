import { Pane, PaneProps } from 'evergreen-ui'
import React from 'react'
import Lottie from 'react-lottie'

import loadingMap from '../animations/location-pin.json'

const centralOption: PaneProps = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
}

export const Loading: React.FC = () => {
  return (
    <Pane {...centralOption}>
      <Lottie
        options={{ loop: true, autoplay: true, animationData: loadingMap }}
      />
    </Pane>
  )
}
