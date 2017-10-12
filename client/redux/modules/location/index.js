import { createSelector } from 'reselect'
import createHistory from 'history/createBrowserHistory'
import {
  connectRoutes
} from 'redux-first-router'

import routesMap, {
  routeOptions
} from 'redux/routes/map'
import {
  ROUTE_HOME,
  ROUTE_LOAD
} from 'redux/routes/name'

const history = createHistory()
const routes = connectRoutes(history, routesMap, routeOptions)

// Actions
export function goHome() {
  return {
    type: ROUTE_HOME
  }
}

export function goToLoad() {
  return {
    type: ROUTE_LOAD
  }
}

// Selector
export const selectLocation = (state) => state.get('location')
export const selectType = createSelector(
  selectLocation,
  (state) => state.type
)
export const selectPayload = createSelector(
  selectLocation,
  (state) => state.payload
)
export const selectRoutesMap = createSelector(
  selectLocation,
  (state) => state.routesMap
)
export const selectRouteDefinition = createSelector(
  selectLocation,
  (state) => state.routesMap[state.type]
)
export const selectPage = createSelector(
  selectRouteDefinition,
  (state) => (state ? state.page : null)
)

// middleware
export const middleware = routes.middleware

// enhancer
export const enhancer = routes.enhancer

// Reducer
export default routes.reducer

