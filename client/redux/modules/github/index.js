import { fromJS } from 'immutable'
import { createSelector } from 'reselect'

// Constants
const CHANGE_ORGANIZATION = 'github/CHANGE_ORGANIZATION'
export const LOAD_ORGANIZATIONS = 'github/LOAD_ORGANIZATIONS'
const ORGANIZATIONS_LOADED = 'github/ORGANIZATIONS_LOADED'

const CHANGE_REPOSITORY = 'github/CHANGE_REPOSITORY'
export const LOAD_REPOSITORIES = 'github/LOAD_REPOSITORIES'
const REPOSITORIES_LOADED = 'github/REPOSITORIES_LOADED'

// Actions
export function changeOrganization(id) {
  return {
    type: CHANGE_ORGANIZATION,
    id: id
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

export function changeRepository(id) {
  return {
    type: CHANGE_REPOSITORY,
    id: id
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

// Selector
export const selectGithub = (state) => state.get('github')
export const makeSelectOrganizationList = () => createSelector(
  selectGithub,
  (state) => state.get('organizations')
)
export const makeSelectOrganizationId = () => createSelector(
  selectGithub,
  (state) => state.get('organizationId')
)
export const makeSelectRepositoryList = () => createSelector(
  selectGithub,
  (state) => state.get('repositories')
)
export const makeSelectRepositoryId = () => createSelector(
  selectGithub,
  (state) => state.get('repositoryId')
)

// Initial State
const initialState = fromJS({
  organizations: [],
  organizationId: '',
  repositories: [],
  repositoryId: '',
  name: ''
})

// Reducer
export default function reducer(state = initialState, action) {
  switch(action.type){
    case CHANGE_ORGANIZATION:
      return state.set('organizationId', action.id)
    case ORGANIZATIONS_LOADED:
      return state.set('organizations', action.list)
    case CHANGE_REPOSITORY:
      return state.set('repositoryId', action.id)
    case REPOSITORIES_LOADED:
      return state.set('repositories', action.list)
    default:
      return state
  }
}

