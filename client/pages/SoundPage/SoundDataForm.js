import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import AssetDataForm, { FormGroupRow } from 'components/AssetDataForm'
import Audio from 'components/Audio'

import messages from './messages'

const soundLabel = (<FormattedMessage {...messages.sound} />)

const SoundPlayer = ({ src }) => (
  <FormGroupRow label={soundLabel}>
    <Audio
      name="sound"
      src={src}
      autoplay
    />
  </FormGroupRow>
)
SoundPlayer.propTypes = {
  src: PropTypes.string.isRequired
}

const SoundDataForm = ({ height }) => (
  <AssetDataForm
    module="sound"
    category="sounds"
    height={height}
  >
    {SoundPlayer}
  </AssetDataForm>
)

SoundDataForm.defaultProps = {
  height: ''
}

SoundDataForm.propTypes = {
  height: PropTypes.string
}

export default SoundDataForm

