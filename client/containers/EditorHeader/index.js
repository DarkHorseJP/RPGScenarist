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
  selectOrganizationName,
  selectRepository,
  selectRepositoryName
} from 'redux/modules/github'

class EditorHeader extends React.PureComponent {
  render() {
    let orgLink = '#'
    let orgAvatar = ''
    let repLink = '#'
    const repoName = this.props.repoName || ''
    let separator = ''

    if(this.props.orgName){
      orgLink = `/edit/${this.props.orgName}`
      const orgAvatarURL = this.props.org.getIn(['account', 'avatar_url']) + '&s=40'
      orgAvatar = <img src={orgAvatarURL} width="20" height="20" />
      if(this.props.repoName){
        repLink = `/edit/${this.props.orgName}/${this.props.repoName}`
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
            <span className="hidden-xs"><Link to={orgLink}>{orgAvatar}</Link>{separator}</span><Link to={repLink}>{repoName}</Link>
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
  org: selectOrganization,
  orgName: selectOrganizationName,
  repo: selectRepository,
  repoName: selectRepositoryName
})

export default connect(mapStateToProps, mapDispatchToProps)(EditorHeader)
