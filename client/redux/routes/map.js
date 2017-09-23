import { redirect } from 'redux-first-router'
import { fromJS } from 'immutable'

import {
  userLoaded,
  organizationsLoaded,
  repositoriesLoaded,
  getUser,
  getOrganizations,
  getRepositories
} from 'redux/modules/github'
import * as Route from './name'

const isAllowed = (type, user, routesMap) => {
  const role = routesMap[type] && routesMap[type].role

  if (!role) return true
  if (!user || !user.roles) return false

  return user.roles.includes(role)
}

export const routeOptions = {
  location: (state) => {
    const loc = state.get('location')
    return (loc && loc.toJS) ? loc.toJS() : loc
  },
  onBeforeChange: (dispatch, getState, action) => {
    const state = getState()
    const user = state.getIn(['github', 'user'])
    if (typeof user.name === 'undefined' && localStorage.token) {
      getUser().then((userData) => {
        dispatch(userLoaded(userData))
      })
      return
    }
    const loc = state.get('location')
    const routesMap = loc.routesMap
    const allowed = isAllowed(action.type, user, routesMap)

    if (!allowed) {
      const redirectAction = redirect({ type: 'LOGIN' })
      dispatch(redirectAction)
    }
  },
  onAfterChange: () => {
  }
}

const routesMap = {
  [Route.ROUTE_HOME]: {
    path: '/',
    page: 'HomePage'
  },
  [Route.ROUTE_ORGS]: {
    path: '/edit',
    page: 'RepositoryPage',
    thunk: async (dispatch) => {
      getOrganizations().then((data) => {
        dispatch(organizationsLoaded(data))
      })
      dispatch(repositoriesLoaded(fromJS([])))
    }
  },
  [Route.ROUTE_ORG_REPOS]: {
    path: '/edit/:orgname',
    page: 'RepositoryPage',
    thunk: async (dispatch, getState) => {
      const state = getState()
      const orgname = state.get('location').payload.orgname
      getOrganizations().then((orgData) => {
        const org = orgData.find((data) => data.getIn(['account', 'login']) == orgname) // eslint-disable-line eqeqeq
        if (org) {
          getRepositories(org.get('id')).then((data) => {
            dispatch(repositoriesLoaded(data))
          })
        }
        dispatch(organizationsLoaded(orgData))
      })
    }
  },
  [Route.ROUTE_EDIT]: {
    path: '/edit/:orgname/:reponame',
    page: 'EditorPage',
    thunk: async (dispatch, getState) => {
      const state = getState()
      const orgname = state.get('location').payload.orgname
      getOrganizations().then((orgData) => {
        const org = orgData.find((data) => data.getIn(['account', 'login']) == orgname) // eslint-disable-line eqeqeq
        if (org) {
          getRepositories(org.get('id')).then((data) => {
            dispatch(repositoriesLoaded(data))
          })
        }
        dispatch(organizationsLoaded(orgData))
      })
    }
  }
}

export default routesMap

