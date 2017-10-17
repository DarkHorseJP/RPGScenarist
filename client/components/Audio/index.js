import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import {
  loadAudio,
  audioLoaded,
  audioEnded,
  currentTimeChanged,
  playAudio,
  pauseAudio,
  // setCurrentTime
  makeSelectPlay,
  makeSelectCurrentTime
} from 'redux/modules/audio'

import Skin from './Skin'

const AudioComponent = (props) => (<div>{props.children(props)}</div>)
AudioComponent.propTypes = {
  onPlay: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  onPause: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  children: PropTypes.func.isRequired
}

class Audio extends React.Component {
  componentDidMount() {
    const {
      name,
      onLoad
    } = this.props

    const audioDispatchToProps = (dispatch) => ({
      onPlay: () => { dispatch(playAudio(name)) },
      onPause: () => { dispatch(pauseAudio(name)) }
    })

    const audioStateToProps = createStructuredSelector({
      play: makeSelectPlay(name),
      currentTime: makeSelectCurrentTime(name)
    })

    this.audioComponent = connect(audioStateToProps, audioDispatchToProps)(AudioComponent)

    loadAudio(this.props).then((audio) => {
      console.log(`audio: ${typeof audio}`)
      console.log(`name: ${name}`)
      onLoad(name, audio, this.props)
    })
  }

  render() {
    const Component = this.audioComponent
    if (!Component) {
      return null
    }

    const {
      children,
      play,
      ...props
    } = this.props

    return (
      <Component {...props}>
        {children}
      </Component>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  onLoad: (name, audio, props) => dispatch(audioLoaded(name, audio, props)),
  onEnded: (name) => dispatch(audioEnded(name)),
  onTimeChanged: (name, next) => dispatch(currentTimeChanged(name, next))
})

Audio.defaultProps = {
  children: Skin,
  loop: false,
  loopStart: 0,
  loopEnd: 0,
  gain: 1.0,
  playbackRate: 1.0,
  play: false,
  onComplete: () => {},
  onStateChange: () => {},
  onTimeChange: () => {},
  onError: (err) => { throw err }
}

Audio.propTypes = {
  children: PropTypes.func,
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  loop: PropTypes.bool,
  loopStart: PropTypes.number,
  loopEnd: PropTypes.number,
  gain: PropTypes.number,
  playbackRate: PropTypes.number,
  play: PropTypes.bool,
  onComplete: PropTypes.func,
  onStateChange: PropTypes.func,
  onTimeChange: PropTypes.func,
  onError: PropTypes.func,

  onLoad: PropTypes.func.isRequired,
  onEnded: PropTypes.func.isRequired,
  onTimeChanged: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(Audio)

