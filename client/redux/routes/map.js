import { redirect, NOT_FOUND } from 'redux-first-router'
import { fromJS } from 'immutable'

import * as Route from './name'
import { 
  userLoaded, 
  organizationsLoaded,
  repositoriesLoaded,
  repositoryLoaded,
  getUser, 
  getOrganizations, 
  getRepositories,
  setRepositoryId
} from 'redux/modules/github'

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
      return getUser().then((user) => {
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
  [Route.ROUTE_HOME]: {
    path: '/',
    page: 'HomePage'
  },
  [Route.ROUTE_ORGS]: {
    path: '/edit',
    page: 'RepositoryPage',
    thunk: async (dispatch, getState) => {
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
        const org = orgData.find(org => org.getIn(['account', 'login']) == orgname)
        if(org){
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
      getOrganizations().then((data) => {
        if(org){
          getRepositories(org.get('id')).then((data) => {
            dispatch(repositoriesLoaded(data))
          })
        }
        dispatch(organizationsLoaded(data))
      })
    }
  }
}

export default routesMap

