import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { FormattedNumber } from 'react-intl'
import Helmet from 'react-helmet'
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import Link from 'redux-first-router-link'

import LinkItem from 'components/LinkItem'

import { 
  selectGithubUser,
  selectOrganization,
  selectRepository
} from 'redux/modules/github'

class EditorHeader extends React.PureComponent {
  render() {
    let orgLink = '#'
    let orgAvatar = ''
    let repLink = '#'
    let repName = ''
    let separator = ''

    if(this.props.organization && this.props.organization.get('id')){
      orgLink = `/orgs/${this.props.organization.get('id')}/repos`
      const orgAvatarURL = this.props.organization.getIn(['account', 'avatar_url']) + '&s=40'
      orgAvatar = <img src={orgAvatarURL} width="20" height="20" />
      if(this.props.repository && this.props.repository.has('id')){
        repLink = `/edit/${this.props.organization.get('id')}/${this.props.repository.get('id')}`
        repName = this.props.repository.get('name')
        separator = ' / '
      }
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
            <span className="hidden-xs"><Link to={orgLink}>{orgAvatar}</Link>{separator}</span><Link to={repLink}>{repName}</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.props.children}
          <Nav pullRight>
            <NavDropdown title="PageName" id="editorPageName">
              <LinkItem tag={MenuItem} href="#">AnotherPageName</LinkItem>
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
