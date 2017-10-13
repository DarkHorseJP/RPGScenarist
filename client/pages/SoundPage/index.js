import React from 'react'
import Helmet from 'react-helmet'

import CommonHeader from 'components/CommonHeader'
import EditorHeader from 'components/EditorHeader'
import DisableScroll from 'components/DisableScroll'

import SoundEditor from './SoundEditor'

const SoundPage = () => (
  <div>
    <Helmet title="Sound Editor" />
    <DisableScroll />
    <CommonHeader />
    <EditorHeader pageName="sounds" />
    <SoundEditor />
  </div>
)

export default SoundPage

