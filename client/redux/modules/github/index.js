import { fromJS } from 'immutable'
import { createSelector } from 'reselect'
import JSZip from 'jszip'
import {
  ROUTE_IMAGE_EDIT,
  ROUTE_SOUND_EDIT,
  isRouteAction
} from 'redux/routes/name'

import request from 'utils/request'

// Constants
const LOAD_USER = 'github/LOAD_USER'
const USER_LOADED = 'github/USER_LOADED'

const LOAD_ORGANIZATIONS = 'github/LOAD_ORGANIZATIONS'
const ORGANIZATIONS_LOADED = 'github/ORGANIZATIONS_LOADED'

const LOAD_REPOSITORIES = 'github/LOAD_REPOSITORIES'
const REPOSITORIES_LOADED = 'github/REPOSITORIES_LOADED'

const LOAD_GAME_DATA = 'github/LOAD_GAME_DATA'
const GAME_DATA_LOADED = 'github/GAME_DATA_LOADED'

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

export function gameDataLoaded(data) {
  return {
    type: GAME_DATA_LOADED,
    data
  }
}

export function loadGameData(repoid) {
  return {
    type: LOAD_GAME_DATA,
    repoid
  }
}

export function changeImage(orgname, reponame, imageid) {
  return {
    type: ROUTE_IMAGE_EDIT,
    payload: { orgname, reponame, imageid }
  }
}

export function changeSound(orgname, reponame, soundid) {
  return {
    type: ROUTE_SOUND_EDIT,
    payload: { orgname, reponame, soundid }
  }
}

const getOptions = (props) => {
  let reqHeader = {
    'X-CSRF-TOKEN': localStorage.getItem('token')
  }
  let prop = {
    credentials: 'same-origin'
  }

  if (props) {
    const { headers, ...userProp } = props
    reqHeader = Object.assign(reqHeader, headers)
    prop = Object.assign(prop, userProp)
  }

  const options = {
    headers: reqHeader,
    ...prop
  }
  return options
}

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
  if (!repositories) {
    return null
  }
  const repository = repositories.find((repo) => repo.get('id') == repoId) // eslint-disable-line eqeqeq
  return repository
}

export async function getArchive(orgname, reponame, ref = 'master') {
  const url = `/github/zipball/${orgname}/${reponame}/${ref}`
  const options = getOptions()
  const zipData = await fetch(url, options)
  const blob = await zipData.blob()
  return JSZip.loadAsync(blob)
}

export async function getHeadSha(instid, orgname, reponame, ref = 'master') {
  const url = `/github/orgs/${instid}/repos/${orgname}/${reponame}/git/refs/heads/${ref}`
  const options = getOptions()
  const data = await fetch(url, options)
  const json = await data.json()
  const sha = json.object ? json.object.sha : null
  return sha
}

export async function createRepository(instId, owner, name) {
  const url = `/github/orgs/${instId}/repos/${owner}`
  const options = getOptions({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name
    })
  })
  const result = await request(url, options)
  return result
}

export async function setRepositoryInfo(instId, owner, repo, name, desc) {
  const url = `/github/orgs/${instId}/repos/${owner}/${repo}`
  const options = getOptions({
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      desc
    })
  })
  const result = await request(url, options)
  return result
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
  (org) => (org ? org.get('id') : null)
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
  (list, name) => (list ? list.find((info) => info.get('name') == name) : null) // eslint-disable-line eqeqeq
)
export const selectRepositoryId = createSelector(
  selectRepository,
  (repo) => repo.get('id')
)

export const selectGameData = createSelector(
  selectGithub,
  (state) => state.get('gameData')
)

export const selectGameImages = createSelector(
  selectGameData,
  (state) => state.get('images')
)

// Initial State
const initialState = fromJS({
  user: {},
  organizations: [],
  organizationName: '',
  repositories: null,
  repositoryName: '',

  gameData: {},
  imageData: {}
})

// Reducer
export default function reducer(state = initialState, action) {
  if (isRouteAction(action.type)) {
    return state.withMutations((s) =>
      s.set('organizationName', action.payload.orgname)
        .set('repositoryName', action.payload.reponame)
    )
  }

  switch (action.type) {
    case USER_LOADED:
      return state.set('user', action.user)
    case ORGANIZATIONS_LOADED:
      return state.set('organizations', action.list)
    case REPOSITORIES_LOADED:
      return state.set('repositories', action.list)
    case GAME_DATA_LOADED:
      return state.set('gameData', action.data)
    default:
      return state
  }
}

