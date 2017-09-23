import React from 'react'
import Helmet from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
// import { createStructuredSelector } from 'reselect'
import Link from 'redux-first-router-link'

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
          <Link to="/edit">/edit</Link>
        </div>
      </div>
    )
  }
}

HomePage.defaultProps = {
}

HomePage.propTypes = {
}

export default connect()(HomePage)

