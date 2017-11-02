import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'

import AssetDataForm, { FormGroupRow, LabeledControl } from 'components/AssetDataForm'
import Audio from 'components/Audio'

import Player from './Player'
import messages from './messages'

const musicLabel = (<FormattedMessage {...messages.music} />)
const loopStartLabel = (<FormattedMessage {...messages.loopStart} />)
const loopEndLabel = (<FormattedMessage {...messages.loopEnd} />)
const volumeLabel = (<FormattedMessage {...messages.volume} />)

const MusicPlayer = ({ src, loopStart, loopEnd, volume }) => (
  <FormGroupRow label={musicLabel}>
    <Audio
      name="music"
      src={src}
      loopStart={loopStart}
      loopEnd={loopEnd}
      gain={volume}
      loop
      autoplay
    >
      {Player}
    </Audio>
  </FormGroupRow>
)
MusicPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  loopStart: PropTypes.number.isRequired,
  loopEnd: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired
}

const MusicDataForm = ({
  height
}) => (
  <AssetDataForm
    module="music"
    category="musics"
    height={height}
  >
    {(props) => (
      <div>
        <LabeledControl
          name="loopStart"
          label={loopStartLabel}
          type="text"
        />
        <LabeledControl
          name="loopEnd"
          label={loopEndLabel}
          type="text"
        />
        <LabeledControl
          name="volume"
          label={volumeLabel}
          type="text"
        />
        <MusicPlayer {...props} />
      </div>
    )}
  </AssetDataForm>
)

MusicDataForm.defaultProps = {
  height: ''
}

MusicDataForm.propTypes = {
  height: PropTypes.string
}

const mapStateToProps = createStructuredSelector({
})

export default connect(mapStateToProps)(MusicDataForm)

