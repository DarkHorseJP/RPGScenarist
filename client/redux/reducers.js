import { fromJS } from 'immutable'
import { combineReducers } from 'redux-immutable'

import language from './modules/language'
import github from './modules/github'
import map from './modules/map'
import window from './modules/window'
import location from './modules/location'

export default function createReducer(asyncReducers) {
  return combineReducers({
    language,
    github,
    map,
    window,
    location,
    ...asyncReducers
  })
}

