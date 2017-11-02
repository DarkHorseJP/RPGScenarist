import { combineReducers } from 'redux-immutable'
import { reducer as form } from 'redux-form/immutable'

import db from './modules/db'
import language from './modules/language'
import github from './modules/github'
import audio from './modules/audio'
import map from './modules/map'
import model from './modules/model'
import image from './modules/image'
import music from './modules/music'
import sound from './modules/sound'
import window from './modules/window'
import location from './modules/location'
import modal from './modules/modal'

export default function createReducer(asyncReducers) {
  return combineReducers({
    db,
    language,
    github,
    audio,
    map,
    model,
    image,
    music,
    sound,
    window,
    location,
    form,
    modal,
    ...asyncReducers
  })
}

