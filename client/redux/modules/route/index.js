import { fromJS } from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'

// Constants

// Actions

// Selector

// Initial State
const initialState = fromJS({
  locationBeforeTranslations: null
})

// Reducer
export default function reducer(state = initialState, action) {
  switch(action.type){
    case LOCATION_CHANGE:
      return state.set('locationBeforeTranslations', action.payload)
    default:
      return state
  }
}

