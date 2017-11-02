import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Glyphicon
} from 'react-bootstrap'


const PlayPauseButton = ({ onPlay, onPause, isPlaying }) => {
  const glyphName = isPlaying ? 'pause' : 'play'
  const handleClick = isPlaying ? onPause : onPlay

  return (
    <Button
      onClick={(e) => {
        e.preventDefault()
        handleClick()
      }}
    >
      <Glyphicon glyph={glyphName} />
    </Button>
  )
}

PlayPauseButton.propTypes = {
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  isPlaying: PropTypes.func.isRequired
}

export default PlayPauseButton

