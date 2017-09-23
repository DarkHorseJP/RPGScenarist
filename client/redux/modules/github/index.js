import { fromJS } from 'immutable'
import { createSelector } from 'reselect'
import {
  ROUTE_ORGS,
  ROUTE_ORG_REPOS,
  ROUTE_EDIT
} from 'redux/routes/name'

import request from 'utils/request'

// Constants
const LOAD_USER = 'github/LOAD_USER'
const USER_LOADED = 'github/USER_LOADED'

const LOAD_ORGANIZATIONS = 'github/LOAD_ORGANIZATIONS'
const ORGANIZATIONS_LOADED = 'github/ORGANIZATIONS_LOADED'

const LOAD_REPOSITORIES = 'github/LOAD_REPOSITORIES'
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
    user
  }
}

export function organizationsLoaded(list) {
  return {
    type: ORGANIZATIONS_LOADED,
    list
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
    list
  }
}

export function loadRepositories(instid) {
  return {
    type: LOAD_REPOSITORIES,
    instid
  }
}

const getOptions = () => ({
  headers: {
    'X-CSRF-TOKEN': localStorage.getItem('token')
  },
  credentials: 'same-origin'
})

export async function getUser() {
  const url = '/github/user'
  const json = await request(url, getOptions())
  return fromJS(json)
}

export async function getOrganizations() {
  const url = '/github/orgs'
  const json = await request(url, getOptions())
  return fromJS(json)
}

export async function getRepositories(instId) {
  const url = `/github/orgs/${instId}/repos`
  const json = await request(url, getOptions())
  return fromJS(json.repositories)
}

export async function getRepository(instId, repoId) {
  const repositories = getRepositories(instId)
  const repository = repositories.find((repo) => repo.get('id') == repoId) // eslint-disable-line eqeqeq
  return repository
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
export const selectOrganizationName = createSelector(
  selectGithub,
  (state) => state.get('organizationName')
)
export const selectOrganization = createSelector(
  selectOrganizationList, selectOrganizationName,
  (list, name) => list.find((info) => info.getIn(['account', 'login']) == name) // eslint-disable-line eqeqeq
)
export const selectInstallationId = createSelector(
  selectOrganization,
  (org) => org.get('id')
)
export const selectRepositoryList = createSelector(
  selectGithub,
  (state) => state.get('repositories')
)
export const selectRepositoryName = createSelector(
  selectGithub,
  (state) => state.get('repositoryName')
)
export const selectRepository = createSelector(
  selectRepositoryList, selectRepositoryName,
  (list, name) => list.find((info) => info.get('name') == name) // eslint-disable-line eqeqeq
)
export const selectRepositoryId = createSelector(
  selectRepository,
  (repo) => repo.get('id')
)

// Initial State
const initialState = fromJS({
  user: {},
  organizations: [],
  organizationName: '',
  repositories: [],
  repositoryName: ''
})

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ROUTE_ORGS:
    case ROUTE_ORG_REPOS:
      return state.set('organizationName', action.payload.orgname)
    case ROUTE_EDIT:
      return state.withMutations((s) =>
        s.set('repositoryName', action.payload.reponame)
          .set('organizationName', action.payload.orgname)
      )

    case USER_LOADED:
      return state.set('user', action.user)
    case ORGANIZATIONS_LOADED:
      return state.set('organizations', action.list)
    case REPOSITORIES_LOADED:
      return state.set('repositories', action.list)
    default:
      return state
  }
}

