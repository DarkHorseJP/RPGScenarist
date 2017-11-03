import React from 'react'
import Helmet from 'react-helmet'

import CommonHeader from 'components/CommonHeader'
import EditorHeader from 'components/EditorHeader'
import DisableScroll from 'components/DisableScroll'

import MotionEditor from './MotionEditor'

const MotionPage = () => (
  <div>
    <Helmet title="Motion Editor" />
    <DisableScroll />
    <CommonHeader />
    <EditorHeader pageName="motions" />
    <MotionEditor />
  </div>
)

export default MotionPage

