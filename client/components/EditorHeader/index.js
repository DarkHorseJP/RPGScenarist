import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Helmet from 'react-helmet'
import { Nav, Navbar, NavItem, NavDropdown, MenuItem, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import Link from 'redux-first-router-link'

import {
  selectOrganization,
  selectOrganizationName,
  selectRepositoryName
} from 'redux/modules/github'
import {
  commitEditDb,
  finishEditDb,
  selectState
} from 'redux/modules/db'
import LinkItem from 'components/LinkItem'

import messages from './messages'

const EditorHeader = ({ org, orgName, repoName, pageName, onSave, state }) => {
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

  let SaveButton
  if (state === 'upToDate') {
    const tooltip = (
      <Tooltip id="saveButton">
        <FormattedMessage {...messages.dataIsUpToDate} />
      </Tooltip>
    )

    SaveButton = (
      <OverlayTrigger placement="bottom" overlay={tooltip}>
        <Button
          bsStyle="default"
          onClick={(e) => e.preventDefault()}
        >
          <FormattedMessage {...messages.save} />
        </Button>
      </OverlayTrigger>
    )
  } else if (state === 'saving') {
    SaveButton = (
      <Button
        bsStyle="primary"
        disabled
      >
        <FormattedMessage {...messages.saving} />
      </Button>
    )
  } else {
    SaveButton = (
      <Button
        bsStyle="primary"
        onClick={(e) => {
          e.preventDefault()
          onSave()
        }}
      >
        <FormattedMessage {...messages.save} />
      </Button>
    )
  }

  const pageNameObj = messages[pageName] || messages.top
  console.log(`pageName: ${pageName}, pageNameObj: ${JSON.stringify(pageNameObj)}`)

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
          <FormattedMessage {...pageNameObj}>
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
            {SaveButton}
          </Navbar.Form>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const mapStateToProps = createStructuredSelector({
  org: selectOrganization,
  orgName: selectOrganizationName,
  repoName: selectRepositoryName,
  state: selectState
})

const mapDispatchToProps = (dispatch) => ({
  onSave: () => {
    const next = (result) => {
      console.log(`result: ${JSON.stringify(result)}`)
      // TODO: check error
      dispatch(finishEditDb())
    }
    dispatch(commitEditDb(next))
  }
})

EditorHeader.defaultProps = {
  org: null,
  orgName: null,
  repoName: null,
  children: null,
  pageName: '',
  state: ''
}

EditorHeader.propTypes = {
  org: ImmutablePropTypes.map,
  orgName: PropTypes.string,
  repoName: PropTypes.string,
  children: PropTypes.node,
  pageName: PropTypes.string,
  state: PropTypes.string,
  onSave: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorHeader)

