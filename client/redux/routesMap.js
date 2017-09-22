import { redirect, NOT_FOUND } from 'redux-first-router'
import { fromJS } from 'immutable'

import { 
  userLoaded, 
  organizationsLoaded,
  repositoriesLoaded,
  getUser, 
  getOrganizations, 
  getRepositories 
} from './modules/github'

export const ROUTE_HOME = 'routesMap/ROUTE_HOME'
export const ROUTE_ORGS = 'routesMap/ROUTE_ORGS'
export const ROUTE_ORG_REPOS = 'routesMap/ROUTE_ORG_REPOS'
export const ROUTE_EDIT = 'routesMap/ROUTE_EDIT'

const isAllowed = (type, user, routesMap) => {
  const role = routesMap[type] && routesMap[type].role

  if(!role) return true
  if(!user || !user.roles) return false

  return user.roles.includes(role)
}

export const routeOptions = {
  location: state => {
    const loc = state.get('location')
    return (loc && loc.toJS) ? loc.toJS() : loc
  },
  onBeforeChange: (dispatch, getState, action) => {
    const state = getState()
    const user = state.getIn(['github', 'user'])
    if(typeof user.name === 'undefined' && localStorage.token){
      getUser().then((user) => {
        dispatch(userLoaded(user))
      })
    }
    const loc = state.get('location')
    const routesMap = loc.routesMap
    const allowed = isAllowed(action.type, user, routesMap)

    if(!allowed){
      const action = redirect({ type: 'LOGIN' })
      return dispatch(action)
    }
  },
  onAfterChange: (dispatch, getState) => {
  }
}

const routesMap = {
  [ROUTE_HOME]: {
    path: '/',
    page: 'HomePage'
  },
  [ROUTE_ORGS]: {
    path: '/orgs',
    page: 'RepositoryPage',
    thunk: async (dispatch, getState) => {
      getOrganizations().then((data) => {
        dispatch(organizationsLoaded(data))
      })
      dispatch(repositoriesLoaded(fromJS([])))
    }
  },
  [ROUTE_ORG_REPOS]: {
    path: '/orgs/:orgid/repos',
    page: 'RepositoryPage',
    thunk: async (dispatch, getState) => {
      const state = getState()
      const orgid = state.get('location').payload.orgid
      getOrganizations().then((data) => {
        dispatch(organizationsLoaded(data))
      })
      getRepositories(orgid).then((data) => {
        dispatch(repositoriesLoaded(data))
      })
    }
  },
  [ROUTE_EDIT]: {
    path: '/edit/:repoid',
    page: 'EditorPage'
  }
}

export default routesMap

