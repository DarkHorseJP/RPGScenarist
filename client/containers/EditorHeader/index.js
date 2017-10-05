import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Helmet from 'react-helmet'
import { Nav, Navbar, NavDropdown, MenuItem } from 'react-bootstrap'
import Link from 'redux-first-router-link'

import LinkItem from 'components/LinkItem'

import {
  selectOrganization,
  selectOrganizationName,
  selectRepositoryName
} from 'redux/modules/github'

const EditorHeader = ({ org, orgName, repoName, children, pageName }) => {
  let orgLink = '#'
  let orgAvatar = ''
  let repLink = '#'
  let separator = ''

  let mapLink = '#'
  let modelLink = '#'
  let motionLink = '#'
  let imageLink = '#'
  let musicLink = '#'
  let soundLink = '#'

  if (org) {
    orgLink = `/edit/${orgName}`
    const orgAvatarURL = `${org.getIn(['account', 'avatar_url'])}&s=40`
    orgAvatar = <img alt={orgName} src={orgAvatarURL} width="20" height="20" />
    if (repoName) {
      repLink = `/edit/${orgName}/${repoName}`
      separator = ' / '

      mapLink = `${repLink}/maps`
      modelLink = `${repLink}/model`
      motionLink = `${repLink}/motions`
      imageLink = `${repLink}/images`
      musicLink = `${repLink}/musics`
      soundLink = `${repLink}/sounds`
    }
  }

  return (
    <Navbar fixedTop fluid style={{ top: '50px', zIndex: '970' }}>
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
        {children}
        <Nav pullRight>
          <NavDropdown title={pageName} id="editorPageName">
            <LinkItem tag={MenuItem} href={repLink}>Info</LinkItem>
            <LinkItem tag={MenuItem} href={mapLink}>Map</LinkItem>
            <LinkItem tag={MenuItem} href={modelLink}>Model</LinkItem>
            <LinkItem tag={MenuItem} href={motionLink}>Motion</LinkItem>
            <LinkItem tag={MenuItem} href={imageLink}>Image</LinkItem>
            <LinkItem tag={MenuItem} href={musicLink}>Music</LinkItem>
            <LinkItem tag={MenuItem} href={soundLink}>Sound</LinkItem>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const mapStateToProps = createStructuredSelector({
  org: selectOrganization,
  orgName: selectOrganizationName,
  repoName: selectRepositoryName
})

EditorHeader.defaultProps = {
  org: null,
  orgName: null,
  repoName: null,
  children: null,
  pageName: ''
}

EditorHeader.propTypes = {
  org: ImmutablePropTypes.map,
  orgName: PropTypes.string,
  repoName: PropTypes.string,
  children: PropTypes.node,
  pageName: PropTypes.string
}

export default connect(mapStateToProps)(EditorHeader)

