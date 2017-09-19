import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
//import { createStructuredSelector } from 'reselect'

import CommonHeader from 'containers/CommonHeader'
import messages from './messages'

class HomePage extends React.PureComponent {
  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Helmet title="Home" />
        <CommonHeader />
        <div className="contents">
          <h1>RPGScenarist</h1>
          <FormattedMessage {...messages.message01} />
        </div>
      </div>
    )
  }
}

HomePage.propTypes = {
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const mapStateToProps = (state) => {return {}}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

