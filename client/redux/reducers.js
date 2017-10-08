import { combineReducers } from 'redux-immutable'
import { reducer as form } from 'redux-form/immutable'
// import { reducer as modal } from 'redux-modal'

import db from './modules/db'
import language from './modules/language'
import github from './modules/github'
import map from './modules/map'
import image from './modules/image'
import window from './modules/window'
import location from './modules/location'
import modal from './modules/modal'

export default function createReducer(asyncReducers) {
  return combineReducers({
    db,
    language,
    github,
    map,
    image,
    window,
    location,
    form,
    modal,
    ...asyncReducers
  })
}

