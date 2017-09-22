import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import CommonHeader from 'containers/CommonHeader'
import EditorHeader from 'containers/EditorHeader'
import messages from './messages'

class EditorPage extends React.PureComponent {
  componentDidMount() {
  }
  
  //static get sagas() {
  //  return mapSagas
  //}

  render() {
    return (
      <div>
        <Helmet title="Editor" />
        <CommonHeader />
        <EditorHeader />
        Editor Page
      </div>
    )
  }
}

EditorPage.propTypes = {
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const mapStateToProps = createStructuredSelector({
})

export default connect(mapStateToProps, mapDispatchToProps)(EditorPage)

