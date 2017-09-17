import { fromJS } from 'immutable'
import { createSelector } from 'reselect'

// Constants
const OPEN_WINDOW = 'window/OPEN_WINDOW'

// Actions
export function openWindow(page, features = {}) {
  return {
    type: OPEN_WINDOW,
    page: page,
    features: features
  }
}

// Selector
export const selectWindow = (state) => state.get('window')
export const makeSelectWindowList = () => createSelector(
  selectWindow,
  (state) => state.get('list')
)

// Initial State
const initialState = fromJS({
  list: {}
})

// Reducer
export default function reducer(state = initialState, action) {
  switch(action.type){
    case OPEN_WINDOW:
      let features = []
      const featureKeys = Object.keys(action.features)
      for(const key of featureKeys){
        features.push(`${key}=${action.features[key]}`)
      }
      const subwindow = window.open(`./${action.page}.html`, `${action.page}`, features.join(','))
      return state.setIn(['list', action.page], subwindow)
    default:
      return state
  }
}

