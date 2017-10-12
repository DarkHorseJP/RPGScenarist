import React from 'react'
import Helmet from 'react-helmet'

const DisableScroll = () => (
  <Helmet
    style={[
      {
        type: 'text/css',
        cssText: 'html, body { overflow: hidden; }'
      }
    ]}
  />
)

export default DisableScroll

