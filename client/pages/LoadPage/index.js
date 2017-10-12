import React from 'react'
import Helmet from 'react-helmet'
import { ProgressBar } from 'react-bootstrap'

import CommonHeader from 'components/CommonHeader'
import EditorHeader from 'components/EditorHeader'

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

