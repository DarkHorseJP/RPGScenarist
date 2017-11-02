import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { connect } from 'react-redux'
import { Row, Col, Thumbnail } from 'react-bootstrap'

import AssetBrowser from 'components/AssetBrowser'
import { isValidMusicFile, changeMusic } from 'redux/modules/music'

import messages from './messages'

const MusicItemComponent = ({
  id,
  active,
  handleClick
}) => {
  const href = (active ? `musics/${id}` : id)
  const className = (active ? 'active' : '')
  return (
    <Col sm={4} md={3} lg={2}>
      <Thumbnail
        href={href}
        className={className}
        onClick={handleClick}
      >
        {id}
      </Thumbnail>
    </Col>
  )
}
MusicItemComponent.propTypes = {
  id: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
}

const MusicBrowser = ({ intl, onChange }) => (
  <AssetBrowser
    module="music"
    category="musics"
    assetName={intl.formatMessage(messages.assetName)}
    filesName={intl.formatMessage(messages.filesName)}
    fileName={intl.formatMessage(messages.fileName)}
    validate={isValidMusicFile}
    groupComponent={Row}
    itemComponent={MusicItemComponent}
    onChange={onChange}
  />
)
MusicBrowser.propTypes = {
  intl: intlShape.isRequired,
  onChange: PropTypes.func.isRequired
}

const mapStateToProps = null

const mapDispatchToProps = (dispatch) => ({
  onChange: (org, repo, category, id) => {
    dispatch(changeMusic(org, repo, id))
  }
})

const IntlMusicBrowser = injectIntl(MusicBrowser)

export default connect(mapStateToProps, mapDispatchToProps)(IntlMusicBrowser)

