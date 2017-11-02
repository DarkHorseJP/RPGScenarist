import React from 'react'
import Helmet from 'react-helmet'

import CommonHeader from 'components/CommonHeader'
import EditorHeader from 'components/EditorHeader'
import DisableScroll from 'components/DisableScroll'

import MusicEditor from './MusicEditor'

const MusicPage = () => (
  <div>
    <Helmet title="Music Editor" />
    <DisableScroll />
    <CommonHeader />
    <EditorHeader pageName="musics" />
    <MusicEditor />
  </div>
)

export default MusicPage

