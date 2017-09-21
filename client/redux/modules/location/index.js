import { fromJS } from 'immutable'
import { createSelector } from 'reselect'
import createHistory from 'history/createBrowserHistory'
import { connectRoutes } from 'redux-first-router'

import routesMap, { routeOptions } from 'redux/routesMap'

const history = createHistory()
const routes = connectRoutes(history, routesMap, routeOptions)

// Constants
export const TEST = 'location/TEST'

// Actions
export function test() {
  return {
    type: TEST
  }
}

// Selector
export const selectLocation = (state) => state.get('location')
export const selectType = createSelector(
  selectLocation,
  (state) => state.type
)
export const selectRoutesMap = createSelector(
  selectLocation,
  (state) => state.routesMap
)
export const selectPage = createSelector(
  selectLocation,
  (state) => state.routesMap[state.type].page
)

// middleware/enhancer
export const middleware = routes.middleware
export const enhancer = routes.enhancer

// Reducer
export default routes.reducer

