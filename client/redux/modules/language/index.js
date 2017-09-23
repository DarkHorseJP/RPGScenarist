import { fromJS } from 'immutable'
import { createSelector } from 'reselect'

import {
  DEFAULT_LOCALE
} from 'config'

// Constants
export const CHANGE_LOCALE = 'language/CHANGE_LOCALE'

// Actions
export function changeLocale(languageLocale) {
  return {
    type: CHANGE_LOCALE,
    locale: languageLocale
  }
}

// Selector
export const selectLanguage = (state) => state.get('language')
export const makeSelectLocale = () => createSelector(
  selectLanguage,
  (languageState) => languageState.get('locale')
)
// export {
//  selectLanguage,
//  makeSelectLocale
// }

// Initial State
let defaultLocale = DEFAULT_LOCALE
if (typeof window === 'object') {
  if (window.navigator.languages && window.navigator.languages.length > 0) {
    defaultLocale = window.navigator.languages[0].split('-')[0]
  }
}

const initialState = fromJS({
  locale: defaultLocale
})

// Reducer
export default function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return state.set('locale', action.locale)
    default:
      return state
  }
}

