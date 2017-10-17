import React from 'react'
import PropTypes from 'prop-types'
import {
  Panel,
  ProgressBar,
  Button,
  Glyphicon
} from 'react-bootstrap'

const PlayButton = ({ onPlay }) => (
  <Button
    onClick={(e) => {
      e.preventDefault()
      onPlay()
    }}
  >
    <Glyphicon glyph="play" />
  </Button>
)
PlayButton.propTypes = {
  onPlay: PropTypes.func.isRequired
}

const PauseButton = ({ onPause }) => (
  <Button
    onClick={(e) => {
      e.preventDefault()
      onPause()
    }}
  >
    <Glyphicon glyph="pause" />
  </Button>
)
PauseButton.propTypes = {
  onPause: PropTypes.func.isRequired
}

class TimeBar extends React.PureComponent {
  getClickedTime(event) {
    const bar = this.node

    const rect = bar.getBoundingClientRect()
    const x = event.pageX - rect.left - window.pageXOffset
    const width = bar.clientWidth
    let time = (x / width) * this.props.duration
    if (time < 0) {
      time = 0
    } else if (time > this.props.duration) {
      time = this.props.duration
    }
    return time
  }

  changeTime(event) {
    const time = this.getClickedTime(event)
    this.props.onChangeCurrentTime(time)
  }

  handleMouseDown(event) {
    event.preventDefault()

    const className = event.target.getAttribute('class')
    if (className === 'progress') {
      this.node = event.target
    } else if (className === 'progress-bar') {
      this.node = event.target.parentElement
    } else {
      throw new Error('unknown element')
    }

    const mouseMoveListener = (e) => {
      e.preventDefault()
      this.changeTime(e)
    }
    const mouseUpListener = (e) => {
      e.preventDefault()
      document.removeEventListener('mousemove', mouseMoveListener)
      document.removeEventListener('mouseup', mouseUpListener)
    }
    document.addEventListener('mousemove', mouseMoveListener)
    document.addEventListener('mouseup', mouseUpListener)
    this.changeTime(event)
  }

  render() {
    const {
      currentTime,
      duration
    } = this.props
    return (
      <ProgressBar
        min={0}
        max={duration}
        now={currentTime}
        onMouseDown={(e) => {
          this.handleMouseDown(e)
        }}
      />
    )
  }
}
TimeBar.propTypes = {
  duration: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  onChangeCurrentTime: PropTypes.func.isRequired
}

const minSecStr = (time) => {
  const min = Math.floor(time / 60)
  const sec = (`0${Math.floor(time % 60)}`).slice(-2)
  return `${min}:${sec}`
}

const Skin = ({ state, play, currentTime, duration, onPlay, onPause, onChangeCurrentTime }) => {
  const PlayPauseButton = play ? PauseButton : PlayButton
  const current = currentTime || 0
  const currentStr = minSecStr(current)
  const durationStr = minSecStr(duration)
  const display = (state === 'loading' ? 'Loading...' : `${currentStr} / ${durationStr}`)

  return (
    <Panel>
      {display}
      <TimeBar
        currentTime={currentTime}
        duration={duration}
        onChangeCurrentTime={onChangeCurrentTime}
      />
      <PlayPauseButton onPlay={onPlay} onPause={onPause} />
    </Panel>
  )
}

Skin.propTypes = {
  state: PropTypes.string.isRequired,
  play: PropTypes.bool.isRequired,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onChangeCurrentTime: PropTypes.func.isRequired
}

export default Skin

