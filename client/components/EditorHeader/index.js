import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Helmet from 'react-helmet'
import { Nav, Navbar, NavItem, NavDropdown, MenuItem, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import Link from 'redux-first-router-link'

import {
  selectOrganization,
  selectOrganizationName,
  selectRepositoryName
} from 'redux/modules/github'
import LinkItem from 'components/LinkItem'

import messages from './messages'

const EditorHeader = ({ org, orgName, repoName, pageName }) => {
  let orgLink = '#'
  let orgAvatar = ''
  let repLink = '#'
  // let separator = ''

  let generalLink = '#'
  let releaseLink = '#'
  let dbLink = '#'
  let battleLink = '#'
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

      generalLink = `${repLink}/general`
      releaseLink = `${repLink}/releases`
      mapLink = `${repLink}/maps`
      battleLink = `${repLink}/battle`
      dbLink = `${repLink}/database`
      modelLink = `${repLink}/models`
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
            cssText: 'body {padding-top: 103px}'
          }
        ]}
      />
      <Navbar.Header>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavItem>
            <Link to={orgLink}>{orgAvatar}</Link>
          </NavItem>
          <NavItem>
            <Link to={repLink}>{repoName}</Link>
          </NavItem>
          <FormattedMessage {...messages[pageName]}>
            {(translatedPageName) => (
              <NavDropdown title={translatedPageName} id="editorPageName">
                <LinkItem tag={MenuItem} href={generalLink}>
                  <FormattedMessage {...messages.general} />
                </LinkItem>
                <LinkItem tag={MenuItem} href={releaseLink}>
                  <FormattedMessage {...messages.releases} />
                </LinkItem>
                <MenuItem divider />
                <LinkItem tag={MenuItem} href={mapLink}>
                  <FormattedMessage {...messages.maps} />
                </LinkItem>
                <LinkItem tag={MenuItem} href={battleLink}>
                  <FormattedMessage {...messages.battle} />
                </LinkItem>
                <LinkItem tag={MenuItem} href={dbLink}>
                  <FormattedMessage {...messages.database} />
                </LinkItem>
                <MenuItem divider />
                <LinkItem tag={MenuItem} href={modelLink}>
                  <FormattedMessage {...messages.models} />
                </LinkItem>
                <LinkItem tag={MenuItem} href={motionLink}>
                  <FormattedMessage {...messages.motions} />
                </LinkItem>
                <LinkItem tag={MenuItem} href={imageLink}>
                  <FormattedMessage {...messages.images} />
                </LinkItem>
                <LinkItem tag={MenuItem} href={musicLink}>
                  <FormattedMessage {...messages.musics} />
                </LinkItem>
                <LinkItem tag={MenuItem} href={soundLink}>
                  <FormattedMessage {...messages.sounds} />
                </LinkItem>
              </NavDropdown>
            )}
          </FormattedMessage>
        </Nav>
        <Nav pullRight>
          <Navbar.Form>
            <Button bsStyle="primary">
              <FormattedMessage {...messages.save} />
            </Button>
          </Navbar.Form>
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

