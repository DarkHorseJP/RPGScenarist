import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { FormattedNumber } from 'react-intl'
import Helmet from 'react-helmet'
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

import { loadUser, selectGithubUser } from 'redux/modules/github'

class CommonHeader extends React.PureComponent {
  render() {
    let loginOrUser
    if(!this.props.user.has || !this.props.user.has('name')){
      loginOrUser = <NavItem eventKey="login" href="/github/auth">Log In</NavItem>
    }else{
      const avatar = <img alt={'@' + this.props.user.get('name')} src={this.props.user.get('avatar_url')} height="20" width="20" />
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
              cssText: 'body {padding-top: 50px}'
            }
          ]} 
        />
        <Navbar.Header>
          <Navbar.Brand> 
            <a href="/">RPGScenarist</a>
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

function mapDispatchToProps(dispatch) {
  return {
    onLoadUser: () => {
      return dispatch(loadUser())
    }
  }
}

const mapStateToProps = createStructuredSelector({
  user: selectGithubUser
})

export default connect(mapStateToProps, mapDispatchToProps)(CommonHeader)
