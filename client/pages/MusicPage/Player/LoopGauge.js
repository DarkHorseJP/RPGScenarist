import React from 'react'
import PropTypes from 'prop-types'
import { ProgressBar } from 'react-bootstrap'

const LoopGauge = ({ loopStart, loopEnd, duration, sampleRate }) => (
  <ProgressBar style={{ margin: 0, height: '2px' }}>
    <ProgressBar bsStyle="success" max={duration * sampleRate} now={loopStart} />
    <ProgressBar bsStyle="warning" max={duration * sampleRate} now={loopEnd - loopStart} />
  </ProgressBar>
)

LoopGauge.propTypes = {
  loopStart: PropTypes.number.isRequired,
  loopEnd: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  sampleRate: PropTypes.number.isRequired
}

export default LoopGauge

