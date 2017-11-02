import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import {
  loadAudio,
  audioLoading,
  audioLoaded,
  audioEnded,
  currentTimeChanged,
  audioUnloaded,

  playAudio,
  pauseAudio,
  setCurrentTime,
  setVolume,

  makeSelectState,
  makeSelectPlay,
  makeSelectCurrentTime,
  makeSelectDuration,
  makeSelectVolume,
  makeSelectSampleRate
} from 'redux/modules/audio'

import Skin from './Skin'

const AudioComponent = (props) => (<div className="audio-player">{props.children(props)}</div>)
AudioComponent.propTypes = {
  children: PropTypes.func.isRequired
}

class Audio extends React.Component {
  componentWillMount() {
    const {
      name,
      onPlay,
      onPause,
      onChangeCurrentTime,
      onChangeVolume
    } = this.props

    const audioDispatchToProps = () => ({
      onPlay: () => { onPlay(name) },
      onPause: () => { onPause(name) },
      onChangeCurrentTime: (time) => { onChangeCurrentTime(name, time) },
      onChangeVolume: (volume) => { onChangeVolume(name, volume) }
    })

    const audioStateToProps = createStructuredSelector({
      state: makeSelectState(name),
      play: makeSelectPlay(name),
      currentTime: makeSelectCurrentTime(name),
      duration: makeSelectDuration(name),
      volume: makeSelectVolume(name),
      sampleRate: makeSelectSampleRate(name)
    })

    this.audioComponent = connect(audioStateToProps, audioDispatchToProps)(AudioComponent)
  }

  componentDidMount() {
    const {
      name,
      onLoading,
      onLoad,
      onPlay,
      autoplay
    } = this.props

    onLoading(name)
    loadAudio(this.props).then((audio) => {
      onLoad(name, audio, this.props)
      if (autoplay) {
        onPlay(name)
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name) {
      // TODO: handle changing name
    }

    if (this.props.src !== nextProps.src) {
      const onLoad = nextProps.onLoad
      const newProps = Object.assign({}, nextProps, { currentTime: 0 })
      console.log(`newProps: ${JSON.stringify(newProps)}`)
      newProps.onLoading(newProps.name)
      loadAudio(newProps).then((audio) => {
        onLoad(newProps.name, audio, newProps)
        if (newProps.autoplay) {
          newProps.onPlay(newProps.name)
        }
      })
    }
  }

  componentWillUnmount() {
    this.props.onUnload(this.props.name)
  }

  render() {
    const Component = this.audioComponent

    const {
      children,
      play,
      ...props
    } = this.props

    return (
      <Component ref={(r) => { this.ref = r }} {...props}>
        {children}
      </Component>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  onLoading: (name) => dispatch(audioLoading(name)),
  onLoad: (name, audio, props) => dispatch(audioLoaded(name, audio, props)),
  onEnded: (name) => dispatch(audioEnded(name)),
  onTimeChanged: (name, next) => dispatch(currentTimeChanged(name, next)),
  onUnload: (name) => dispatch(audioUnloaded(name)),

  onPlay: (name) => { dispatch(playAudio(name)) },
  onPause: (name) => { dispatch(pauseAudio(name)) },
  onChangeCurrentTime: (name, time) => { dispatch(setCurrentTime(name, time)) },
  onChangeVolume: (name, volume) => { dispatch(setVolume(name, volume)) }
})

Audio.defaultProps = {
  children: Skin,
  loop: false,
  loopStart: 0,
  loopEnd: 0,
  gain: 1.0,
  playbackRate: 1.0,
  autoplay: false,
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
  autoplay: PropTypes.bool,
  play: PropTypes.bool,
  onComplete: PropTypes.func,
  onStateChange: PropTypes.func,
  onTimeChange: PropTypes.func,
  onError: PropTypes.func,

  onLoading: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired,
  onEnded: PropTypes.func.isRequired,
  onTimeChanged: PropTypes.func.isRequired,
  onUnload: PropTypes.func.isRequired,

  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onChangeCurrentTime: PropTypes.func.isRequired,
  onChangeVolume: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(Audio)

