import { redirect, NOT_FOUND } from 'redux-first-router'
import { loadOrganizations, loadRepositories } from './modules/github'

const isAllowed = (type, user, routesMap) => {
  const role = routesMap[type] && routesMap[type].role

  if(!role) return true
  if(!user) return false

  return user.roles.includes(role)
}

export const routeOptions = {
  location: state => {
    const loc = state.get('location')
    return (loc && loc.toJS) ? loc.toJS() : loc
  },
  onBeforeChange: (dispatch, getState, action) => {
    const state = getState()
    const user = state.get('user')
    const routesMap = state.get('location').routesMap
    console.log(JSON.stringify(routesMap))
    const allowed = isAllowed(action.type, user, routesMap)

    if(!allowed){
      const action = redirect({ type: 'LOGIN' })
      dispatch(action)
    }
  },
  onAfterChange: (dispatch, getState) => {
  }
}

const routesMap = {
  HOME: {
    path: '/',
    page: 'HomePage'
  },
  ORGS: {
    path: '/orgs',
    page: 'RepositoryPage',
    thunk: async (dispatch, getState) => {
      const { github } = getState()
      if(github.has('organizations')){
        return null
      }
      return dispatch(loadOrganizations())
    }
  },
  ORG_REPOS: {
    path: '/orgs/:orgid/repos',
    page: 'RepositoryPage',
    thunk: async (dispatch, getState) => {
      const { github, location } = getState()
      if(github.has('repositories')){
        return null
      }
      return dispatch(loadRepositories(location.payload.orgid))
    }
  }
}

export default routesMap

