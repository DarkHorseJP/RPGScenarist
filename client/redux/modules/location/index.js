import { applyMiddleware } from 'redux'
import { fromJS } from 'immutable'
import { createSelector } from 'reselect'
import createHistory from 'history/createBrowserHistory'
import { connectRoutes } from 'redux-first-router'

import routesMap, { 
  routeOptions
} from 'redux/routes/map'
import {
  ROUTE_HOME,
  ROUTE_ORGS
} from 'redux/routes/name'

const history = createHistory()
const routes = connectRoutes(history, routesMap, routeOptions)

// Actions
export function goHome() {
  return {
    type: ROUTE_HOME
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

// middleware
export const middleware = routes.middleware

// enhancer
export const enhancer = routes.enhancer

// Reducer
export default routes.reducer

