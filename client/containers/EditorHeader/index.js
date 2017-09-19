import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { FormattedNumber } from 'react-intl'
import Helmet from 'react-helmet'
import { Nav, Navbar, NavItem } from 'react-bootstrap'

import { makeSelectGithubUser } from 'redux/modules/github'

class EditorHeader extends React.PureComponent {
  render() {
    return (
      <Navbar fixedTop fluid style={{top: "50px", zIndex: "970"}}>
        <Helmet
          style={[
            {
              type: 'text/css',
              cssText: 'body {padding-top: 100px}'
            }
          ]} 
        />
        <Navbar.Header>
          <Navbar.Link href="#">Orgs</Navbar.Link>
          <Navbar.Link href="#">Repos</Navbar.Link>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.props.children}
          <Navbar.Text>PageName</Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectGithubUser()
})

export default connect(mapStateToProps, mapDispatchToProps)(EditorHeader)
