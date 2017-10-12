import React from 'react'
import Helmet from 'react-helmet'

import CommonHeader from 'components/CommonHeader'
import EditorHeader from 'components/EditorHeader'
import DisableScroll from 'components/DisableScroll'

import ImageEditor from './ImageEditor'

const ImagePage = () => (
  <div>
    <Helmet title="Image Editor" />
    <DisableScroll />
    <CommonHeader />
    <EditorHeader pageName="Image" />
    <ImageEditor />
  </div>
)

export default ImagePage

