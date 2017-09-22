import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { FormattedNumber } from 'react-intl'
import Helmet from 'react-helmet'
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

import { 
  selectGithubUser,
  selectOrganization,
  selectRepository
} from 'redux/modules/github'

class EditorHeader extends React.PureComponent {
  render() {
    let orgLink, orgAvatar
    if(this.props.organization && this.props.organization.get('id')){
      console.log(JSON.stringify(this.props.organization))
      orgLink = `/organizations/${this.props.organization.get('id')}`
      const orgAvatarURL = this.props.organization.getIn(['account', 'avatar_url']) + '&s=40'
      orgAvatar = <img src={orgAvatarURL} width="20" height="20" />
    }else{
      orgLink = '#'
      orgAvatar = ''
    }

    let repLink, repName, separator
    if(this.props.repository && this.props.repository.has('id')){
      repLink = `/organizations/${this.props.organization.get('id')}/repositories/${this.props.repository.get('id')}`
      repName = this.props.repository.get('name')
      separator = ' / '
    }else{
      repLink = '#'
      repName = ''
      separator = ''
    }
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
          <Navbar.Brand>
            <span className="hidden-xs"><a href={orgLink}>{orgAvatar}</a>{separator}</span><a href={repLink}>{repName}</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.props.children}
          <Nav pullRight>
            <NavDropdown title="PageName" id="editorPageName">
              <MenuItem href="#">AnotherPageName</MenuItem>
            </NavDropdown>
          </Nav>
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
  user: selectGithubUser,
  organization: selectOrganization,
  repository: selectRepository
})

export default connect(mapStateToProps, mapDispatchToProps)(EditorHeader)
