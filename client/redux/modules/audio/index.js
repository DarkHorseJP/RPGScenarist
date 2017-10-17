import { fromJS } from 'immutable'
import { createSelector } from 'reselect'

// Constants
export const AUDIO_LOADING = 'audio/AUDIO_LOADING'
export const AUDIO_LOADED = 'audio/AUDIO_LOADED'
export const AUDIO_UNLOADED = 'audio/AUDIO_UNLOADED'
export const PLAY_AUDIO = 'audio/PLAY_AUDIO'
export const PAUSE_AUDIO = 'audio/PAUSE_AUDIO'
export const AUDIO_ENDED = 'audio/AUDIO_ENDED'
export const CURRENT_TIME_CHANGED = 'audio/CURRENT_TIME_CHANGED'
export const SET_CURRENT_TIME = 'audio/SET_CURRENT_TIME'
export const SET_VOLUME = 'audio/SET_VOLUME'

const AudioContext = window.AudioContext || window.webkitAudioContext

// Functions
export async function loadAudio(props) {
  const {
    src,
    onError
  } = props
  const errorFunc = onError || ((err) => { throw err })
  try {
    let dataPromise
    if (typeof src === 'undefined') {
      errorFunc(new Error('audio src must be specified'))
    } else if (typeof src === 'string') {
      dataPromise = fetch(src).then((data) => data.arrayBuffer())
    } else if (typeof src === 'object') {
      dataPromise = Promise.resolve(src)
    } else {
      errorFunc(new Error('unsupported audio src type'))
    }

    const context = new AudioContext()
    const data = await dataPromise
    context.buffer = await context.decodeAudioData(data)

    return context
  } catch (err) {
    errorFunc(err)
  }
  return null
}

function registerAudio(state, name, audio, props) {
  if (!audio) {
    return state
  }
  const oldContext = state.getIn([name, 'context'])
  if (oldContext) {
    console.log('context close')
    oldContext.close()
  }

  return state.withMutations((s) => {
    s.setIn([name, 'context'], audio)
      .setIn([name, 'state'], 'ready')
      .setIn([name, 'play'], false)
      .setIn([name, 'loop'], props.loop)
      .setIn([name, 'loopStart'], props.loopStart)
      .setIn([name, 'loopEnd'], props.loopEnd)
      .setIn([name, 'gain'], props.gain)
      .setIn([name, 'playbackRate'], props.playbackRate)
      .setIn([name, 'currentTime'], props.currentTime)
      .setIn([name, 'onEnded'], props.onEnded)
      .setIn([name, 'onTimeChanged'], props.onTimeChanged)
  })
}

// Actions
export function audioLoading(name) {
  return {
    type: AUDIO_LOADING,
    name
  }
}

export function audioLoaded(name, audio, props) {
  return {
    type: AUDIO_LOADED,
    name,
    audio,
    props
  }
}

export function audioUnloaded(name) {
  return {
    type: AUDIO_UNLOADED,
    name
  }
}

export function playAudio(name) {
  console.log(`playAudio: ${name}`)
  return {
    type: PLAY_AUDIO,
    name
  }
}

export function pauseAudio(name) {
  return {
    type: PAUSE_AUDIO,
    name
  }
}

export function audioEnded(name) {
  console.log('audioEnded')
  return {
    type: AUDIO_ENDED,
    name
  }
}

export function currentTimeChanged(name, next) {
  return {
    type: CURRENT_TIME_CHANGED,
    name,
    next
  }
}

export function setCurrentTime(name, time) {
  return {
    type: SET_CURRENT_TIME,
    name,
    time
  }
}

export function setVolume(name, volume) {
  return {
    type: SET_VOLUME,
    name,
    volume
  }
}

// Selector
export const selectAudio = (state) => state.get('audio')
export const makeSelectAudio = (name) => createSelector(
  selectAudio,
  (state) => state.get(name)
)
export const makeSelectState = (name) => createSelector(
  makeSelectAudio(name),
  (state) => (state ? state.get('state') : null)
)
export const makeSelectContext = (name) => createSelector(
  makeSelectAudio(name),
  (state) => (state ? state.get('context') : null)
)
export const makeSelectPlay = (name) => createSelector(
  makeSelectAudio(name),
  (state) => (state ? state.get('play') : null)
)
export const makeSelectCurrentTime = (name) => createSelector(
  makeSelectAudio(name),
  (state) => (state ? state.get('currentTime') : null)
)
export const makeSelectDuration = (name) => createSelector(
  makeSelectContext(name),
  (context) => (context ? context.buffer.duration : null)
)

// Functions
const play = (state, name) => {
  const audioState = state.get(name)
  if (!audioState) {
    return state
  }
  if (audioState.get('state') !== 'ready') {
    return state
  }
  const audio = audioState.get('audio')
  if (audio) {
    return state
  }
  const context = audioState.get('context')
  const source = context.createBufferSource()
  const buffer = context.buffer
  source.buffer = buffer
  source.loop = audioState.get('loop')
  source.loopStart = audioState.get('loopStart') / buffer.sampleRate
  source.loopEnd = audioState.get('loopEnd') / buffer.sampleRate
  source.playbackRate.value = audioState.get('playbackRate')
  if (window.webkitAudioContext) {
    source.connect(context.destination)
  } else {
    const gainNode = context.createGain()
    source.gain = gainNode.gain
    source.connect(gainNode)
    gainNode.connect(context.destination)
  }
  source.gain.value = audioState.get('gain')
  source.onended = () => {
    console.log('onended')
    audioState.get('onEnded')(name)
  }
  const currentTime = audioState.get('currentTime') || 0
  const offset = (currentTime >= buffer.duration ? 0 : currentTime)
  const baseTime = context.currentTime - offset
  source.start(0, offset)

  const onTimeChanged = audioState.get('onTimeChanged')
  const updateCurrentTime = () => {
    const next = () => requestAnimationFrame(updateCurrentTime)
    onTimeChanged(name, next)
  }
  requestAnimationFrame(updateCurrentTime)

  return state.withMutations((s) => {
    s.setIn([name, 'audio'], source)
      .setIn([name, 'play'], true)
      .setIn([name, 'baseTime'], baseTime)
  })
}

// Initial State
const initialState = fromJS({})

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case AUDIO_LOADING: {
      const audio = state.getIn([action.name, 'audio'])
      if (audio) {
        audio.stop()
      }
      return state.withMutations((s) => {
        s.deleteIn([action.name, 'audio'])
          .setIn([action.name, 'play'], false)
          .setIn([action.name, 'state'], 'loading')
      })
    }

    case AUDIO_LOADED:
      console.log(`AUDIO_LOADED: audio: ${action.audio}`)
      return registerAudio(state, action.name, action.audio, action.props)

    case AUDIO_UNLOADED: {
      const audioState = state.get(action.name)
      if (!audioState) {
        return state
      }
      const audio = audioState.get('audio')
      if (audio) {
        audio.stop()
      }
      const context = audioState.get('context')
      if (context) {
        context.close()
      }
      return state.delete(action.name)
    }

    case PLAY_AUDIO:
      return play(state, action.name)

    case PAUSE_AUDIO: {
      const audio = state.getIn([action.name, 'audio'])
      if (!audio) {
        return state
      }
      audio.stop()
      return state.setIn([action.name, 'play'], false)
    }

    case AUDIO_ENDED: {
      const audio = state.getIn([action.name, 'audio'])
      if (!audio) {
        return state
      }
      return state.withMutations((s) => {
        s.deleteIn([action.name, 'audio'])
          .setIn([action.name, 'play'], false)
      })
    }

    case CURRENT_TIME_CHANGED: {
      const context = state.getIn([action.name, 'context'])
      if (!context) {
        return state
      }
      const currentTime = context.currentTime
      const baseTime = state.getIn([action.name, 'baseTime'])
      let time = currentTime - baseTime
      if (time > context.buffer.duration) {
        time = context.buffer.duration
      }
      if (state.getIn([action.name, 'play'])) {
        action.next()
      }
      return state.setIn([action.name, 'currentTime'], time)
    }

    case SET_CURRENT_TIME: {
      const audioState = state.get(action.name)
      if (!audioState) {
        return state
      }
      if (audioState.get('play')) {
        const audio = audioState.get('audio')
        audio.stop()
        const newState = state.setIn([action.name, 'currentTime'], action.time)
        return play(newState, action.name)
      }
      return state.setIn([action.name, 'currentTime'], action.time)
    }

    case SET_VOLUME: {
      const audioState = state.get(action.name)
      if (!audioState) {
        return state
      }
      const audio = audioState.get('audio')
      if (audio) {
        audio.gain.value = action.volume
      }
      return state.setIn([action.name, 'gain'], action.volume)
    }

    default:
      return state
  }
}

