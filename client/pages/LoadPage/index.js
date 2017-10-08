import React from 'react'
import Helmet from 'react-helmet'
import { ProgressBar } from 'react-bootstrap'

import CommonHeader from 'containers/CommonHeader'
import EditorHeader from 'containers/EditorHeader'

const LoadPage = () => (
  <div>
    <Helmet title="Loading..." />
    <CommonHeader />
    <EditorHeader pageName="Loading..." />
    Loading...
    <ProgressBar active now={50} />
  </div>
)

export default LoadPage

