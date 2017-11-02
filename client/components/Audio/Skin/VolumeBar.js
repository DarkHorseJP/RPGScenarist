import React from 'react'
import PropTypes from 'prop-types'
import {
  ProgressBar,
  Glyphicon
} from 'react-bootstrap'

class VolumeBar extends React.PureComponent {
  getClickedVolume(event) {
    const bar = this.node

    const rect = bar.getBoundingClientRect()
    const x = event.pageX - rect.left - window.pageXOffset
    const width = bar.clientWidth
    let volume = (x / width)
    if (volume < 0) {
      volume = 0
    } else if (volume > 1) {
      volume = 1
    }
    return volume
  }

  changeVolume(event) {
    const volume = this.getClickedVolume(event)
    this.props.onChangeVolume(volume)
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
      this.changeVolume(e)
    }
    const mouseUpListener = (e) => {
      e.preventDefault()
      document.removeEventListener('mousemove', mouseMoveListener)
      document.removeEventListener('mouseup', mouseUpListener)
    }
    document.addEventListener('mousemove', mouseMoveListener)
    document.addEventListener('mouseup', mouseUpListener)
    this.changeVolume(event)
  }

  render() {
    const {
      volume
    } = this.props
    return (
      <div>
        <Glyphicon glyph="volume-up" />
        <ProgressBar
          min={0}
          max={1}
          now={volume}
          onMouseDown={(e) => {
            this.handleMouseDown(e)
          }}
        />
      </div>
    )
  }
}
VolumeBar.propTypes = {
  volume: PropTypes.number.isRequired,
  onChangeVolume: PropTypes.func.isRequired
}

export default VolumeBar

