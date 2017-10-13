import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { connect } from 'react-redux'
import { Row, Col, Thumbnail } from 'react-bootstrap'

import AssetBrowser from 'components/AssetBrowser'
import { isValidSoundFile, changeSound } from 'redux/modules/sound'

import messages from './messages'

const SoundItemComponent = ({
  id,
  active,
  handleClick
}) => {
  const href = (active ? `sounds/${id}` : id)
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
SoundItemComponent.propTypes = {
  id: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
}

const SoundBrowser = ({ intl, onChange }) => (
  <AssetBrowser
    module="sound"
    category="sounds"
    assetName={intl.formatMessage(messages.assetName)}
    filesName={intl.formatMessage(messages.filesName)}
    fileName={intl.formatMessage(messages.fileName)}
    validate={isValidSoundFile}
    groupComponent={Row}
    itemComponent={SoundItemComponent}
    onChange={onChange}
  />
)
SoundBrowser.propTypes = {
  intl: intlShape.isRequired,
  onChange: PropTypes.func.isRequired
}

const mapStateToProps = null

const mapDispatchToProps = (dispatch) => ({
  onChange: (org, repo, category, id) => {
    dispatch(changeSound(org, repo, id))
  }
})

const IntlSoundBrowser = injectIntl(SoundBrowser)

export default connect(mapStateToProps, mapDispatchToProps)(IntlSoundBrowser)

