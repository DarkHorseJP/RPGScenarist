import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { fromJS } from 'immutable'
import Helmet from 'react-helmet'
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import Link from 'redux-first-router-link'

import { loadUser, selectGithubUser } from 'redux/modules/github'

class CommonHeader extends React.PureComponent {
  render() {
    let loginOrUser
    if (!this.props.user.has('name')) {
      loginOrUser = <NavItem eventKey="login" href="/github/auth">Log In</NavItem>
    } else {
      const avatar = <img alt={`@${this.props.user.get('name')}`} src={this.props.user.get('avatar_url')} height="20" width="20" />
      loginOrUser = (
        <NavDropdown eventKey="user" title={avatar} id="userMenu">
          <MenuItem eventKey="user.logout" href="/github/logout">Log Out</MenuItem>
        </NavDropdown>
      )
    }

    return (
      <Navbar inverse fixedTop fluid>
        <Helmet
          style={[
            {
              type: 'text/css',
              cssText: 'body {padding-top: 52px}'
            }
          ]}
        />
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">RPGScenarist</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.props.children}
          <Nav pullRight>
            {loginOrUser}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  onLoadUser: () => dispatch(loadUser())
})

const mapStateToProps = createStructuredSelector({
  user: selectGithubUser
})

CommonHeader.defaultProps = {
  user: fromJS({}),
  children: null
}

CommonHeader.propTypes = {
  user: ImmutablePropTypes.map,
  children: PropTypes.node
}

export default connect(mapStateToProps, mapDispatchToProps)(CommonHeader)
