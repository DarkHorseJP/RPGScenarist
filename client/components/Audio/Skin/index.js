import React from 'react'
import PropTypes from 'prop-types'
import {
  Panel,
  Row,
  Col
} from 'react-bootstrap'

import TimeBar from './TimeBar'
import PlayPauseButton from './PlayPauseButton'
import VolumeBar from './VolumeBar'

const minSecStr = (time) => {
  const min = Math.floor(time / 60)
  const sec = (`0${Math.floor(time % 60)}`).slice(-2)
  return `${min}:${sec}`
}

const Skin = ({
  state,
  play,
  currentTime,
  volume,
  duration,
  onPlay,
  onPause,
  onChangeCurrentTime,
  onChangeVolume
}) => {
  const current = currentTime || 0
  const currentStr = minSecStr(current)
  const durationStr = minSecStr(duration)
  const display = (state === 'loading' ? 'Loading...' : `${currentStr} / ${durationStr}`)

  return (
    <Panel>
      <Row>
        <Col xs={6}>
          {display}
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <TimeBar
            currentTime={currentTime}
            duration={duration}
            onChangeCurrentTime={onChangeCurrentTime}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={2}>
          <PlayPauseButton onPlay={onPlay} onPause={onPause} isPlaying={play} />
        </Col>
        <Col xs={4}>
          <VolumeBar
            volume={volume}
            onChangeVolume={onChangeVolume}
          />
        </Col>
      </Row>
    </Panel>
  )
}

Skin.propTypes = {
  state: PropTypes.string.isRequired,
  play: PropTypes.bool.isRequired,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onChangeCurrentTime: PropTypes.func.isRequired,
  onChangeVolume: PropTypes.func.isRequired
}

export default Skin

