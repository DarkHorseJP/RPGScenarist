import { fromJS } from 'immutable'
import { combineReducers } from 'redux-immutable'

import route from './modules/route'
import language from './modules/language'
import github from './modules/github'
import map from './modules/map'
import window from './modules/window'

export default function createReducer(asyncReducers) {
  return combineReducers({
    route,
    language,
    github,
    map,
    window,
    ...asyncReducers
  })
}

