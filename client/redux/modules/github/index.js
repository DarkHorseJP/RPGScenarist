import { fromJS } from 'immutable'
import { createSelector } from 'reselect'
import { ROUTE_ORGS, ROUTE_ORG_REPOS } from 'redux/routesMap'

import request from 'utils/request'

// Constants
export const LOAD_USER = 'github/LOAD_USER'
const USER_LOADED = 'github/USER_LOADED'

export const LOAD_ORGANIZATIONS = 'github/LOAD_ORGANIZATIONS'
const ORGANIZATIONS_LOADED = 'github/ORGANIZATIONS_LOADED'

export const LOAD_REPOSITORIES = 'github/LOAD_REPOSITORIES'
const REPOSITORIES_LOADED = 'github/REPOSITORIES_LOADED'

// Actions
export function loadUser() {
  return {
    type: LOAD_USER
  }
}

export function userLoaded(user) {
  return {
    type: USER_LOADED,
    user: user
  }
}

export function organizationsLoaded(list) {
  return {
    type: ORGANIZATIONS_LOADED,
    list: list
  }
}

export function loadOrganizations() {
  return {
    type: LOAD_ORGANIZATIONS
  }
}

export function repositoriesLoaded(list) {
  return {
    type: REPOSITORIES_LOADED,
    list: list
  }
}

export function loadRepositories(instid) {
  return {
    type: LOAD_REPOSITORIES,
    instid: instid
  }
}

const getOptions = () => {
  return {
    headers: {
      'X-CSRF-TOKEN': localStorage.getItem('token')
    },
    credentials: 'same-origin'
  }
}

export async function getUser() {
  const url = '/github/user'
  const json = await request(url, getOptions())
  return fromJS(json)
}

export async function getOrganizations() {
  const url = '/github/organizations'
  const json = await request(url, getOptions())
  return fromJS(json)
}

export async function getRepositories(instId) {
  const url = `/github/organizations/${instId}/repos`
  const json = await request(url, getOptions())
  return fromJS(json.repositories)
}

// Selector
export const selectGithub = (state) => state.get('github')
export const selectGithubUser = createSelector(
  selectGithub,
  (state) => state.get('user')
)
export const selectOrganizationList = createSelector(
  selectGithub,
  (state) => state.get('organizations')
)
export const selectOrganizationId = createSelector(
  selectGithub,
  (state) => state.get('organizationId')
)
export const selectOrganization = createSelector(
  selectOrganizationList,
  selectOrganizationId,
  (list, id) => list.find(info => info.get('id') == id)
)
export const selectRepositoryList = createSelector(
  selectGithub,
  (state) => state.get('repositories')
)
export const selectRepositoryId = createSelector(
  selectGithub,
  (state) => state.get('repositoryId')
)
export const selectRepository = createSelector(
  selectRepositoryList,
  selectRepositoryId,
  (list, id) => list.find(info => info.get('id') == id)
)

// Initial State
const initialState = fromJS({
  user: {},
  organizations: [],
  organizationId: '',
  repositories: [],
  repositoryId: ''
})

// Reducer
export default function reducer(state = initialState, action) {
  switch(action.type){
    case ROUTE_ORGS:
    case ROUTE_ORG_REPOS:
      return state.set('organizationId', action.payload.orgid)
    case USER_LOADED:
      return state.set('user', action.user)
    case ORGANIZATIONS_LOADED: {
      return state.set('organizations', action.list)
    }
    case REPOSITORIES_LOADED:
      return state.set('repositories', action.list)
    default:
      return state
  }
}

