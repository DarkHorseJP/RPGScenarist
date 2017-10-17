import React from 'react'
import PropTypes from 'prop-types'

const Skin = ({ name, currentTime, onPlay, onPause }) => (
  <div>
    <span>name: {name} </span>
    <span>currentTime: {currentTime}</span>
    <button
      onClick={(e) => {
        e.preventDefault()
        onPlay()
      }}
    >
      Play
    </button>
    <button
      onClick={(e) => {
        e.preventDefault()
        onPause()
      }}
    >
      Pause
    </button>
  </div>
)

Skin.propTypes = {
  name: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired
}

export default Skin

