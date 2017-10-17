import React from 'react'
import Helmet from 'react-helmet'

import CommonHeader from 'components/CommonHeader'
import EditorHeader from 'components/EditorHeader'
import DisableScroll from 'components/DisableScroll'

import ModelEditor from './ModelEditor'

const ModelPage = () => (
  <div>
    <Helmet title="Model Editor" />
    <DisableScroll />
    <CommonHeader />
    <EditorHeader pageName="models" />
    <ModelEditor />
  </div>
)

export default ModelPage

