import React from 'react'
import Helmet from 'react-helmet'
// import { connect } from 'react-redux'
// import { createStructuredSelector } from 'reselect'

import CommonHeader from 'containers/CommonHeader'
import EditorHeader from 'containers/EditorHeader'

import ImageEditor from './ImageEditor'

const ImagePage = () => (
  <div>
    <Helmet title="Image Editor" />
    <CommonHeader />
    <EditorHeader pageName="Image" />
    <ImageEditor />
  </div>
)

// const mapDispatchToProps = (dispatch) => ({
// })
// 
// const mapStateToProps = () => ({})
// 
// ImagePage.defaultProps = {
// }
// 
// ImagePage.propTypes = {
// }

export default ImagePage

