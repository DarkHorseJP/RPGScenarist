import { fromJS } from 'immutable'
import { createSelector } from 'reselect'
import JSZip from 'jszip'
import {
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

export async function getArchive(instid, orgname, reponame, ref = 'master') {
  const url = `/github/orgs/${instid}/repos/${orgname}/${reponame}/zipball/${ref}`
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

export async function getAllSha(instid, orgname, reponame, sha) {
  const url = `/github/orgs/${instid}/repos/${orgname}/${reponame}/git/trees/${sha}`
  const options = getOptions()
  const data = await fetch(url, options)
  const json = await data.json()
  const shaData = {}
  json.tree.forEach((obj) => {
    const path = (obj.type === 'tree' ? `${obj.path}/` : obj.path)
    shaData[path] = obj.sha
  })
  shaData['/'] = json.sha

  return shaData
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

function createBase64(blob) {
  const reader = new FileReader()
  const promise = new Promise((resolve, reject) => {
    reader.onloadend = () => {
      resolve(reader.result.split(',')[1])
    }
    reader.onerror = () => {
      reject(reader)
    }
    reader.onabort = () => {
      reject(reader)
    }
  })
  reader.readAsDataURL(blob)
  return promise
}

export async function createBlob(instid, orgname, reponame, data, isBlob = false) {
  console.log('createBlob start')
  const encoding = (isBlob ? 'base64' : 'utf-8')
  let content
  if (isBlob) {
    console.log('await createBase64')
    content = await createBase64(data)
    console.log('createBase64 done')
  } else if (typeof data === 'string') {
    // nothing to do
  } else if (typeof data === 'object') {
    content = JSON.stringify(data, null, 2)
  } else {
    console.error(`type ${typeof data}`)
    throw new Error(`unsupported data type: ${typeof data}`)
  }

  const url = `/github/orgs/${instid}/repos/${orgname}/${reponame}/git/blobs`
  const options = getOptions({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content,
      encoding
    })
  })
  const result = await request(url, options)
  console.log(`createBlob result: ${JSON.stringify(result)}`)
  return result

  // DEBUG
  // return {
  //   "url": "https://api.github.com/hoge",
  //   "sha": "3a0f86fb8db8eea7ccbb9a95f325ddbedfb25e15"
  // }
}

export async function createTree(instid, orgname, reponame, files, baseTreeSha = null) {
  const url = `/github/orgs/${instid}/repos/${orgname}/${reponame}/git/trees`
  const body = {
    tree: files
  }
  if (baseTreeSha) {
    body.base_tree = baseTreeSha
  }
  const options = getOptions({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  const result = await request(url, options)
  console.log(`createTree result: ${JSON.stringify(result)}\nrequest: ${JSON.stringify(body)}`)
  return result
  // DEBUG
  // return {
  //   "sha": "cd8274d15fa3ae2ab983129fb037999f264ba9a7",
  //   "url": "https://api.github.com/hoge",
  //   "tree": [
  //     {
  //       "path": "hoge",
  //       "mode": "100644",
  //       "type": "blob",
  //       "size": 132,
  //       "sha": "7c258a9869f33c1e1e1f74fbb32f07c86cb5a75b",
  //       "url": "https://api.github.com/hoge"
  //     }
  //   ]
  // }
}

export async function createCommit(instid, orgname, reponame, username, treeSha, parentSha, message = '') {
  const url = `/github/orgs/${instid}/repos/${orgname}/${reponame}/git/commits`
  /*
  const author = {
    name: username,
    date: (new Date()).toISOString()
  }
  */
  const options = getOptions({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      tree: treeSha,
      parents: parentSha
    })
  })
  const result = await request(url, options)
  console.log(`createCommit result: ${JSON.stringify(result)}`)
  return result
  // return {
  //   "sha": "7638417db6d59f3c431d3e1f261cc637155684cd",
  //   "url": "https://api.github.com/hoge",
  //   "author": {
  //   },
  //   "comitter": {
  //   },
  //   "message": "",
  //   "tree": {
  //     "url": "",
  //     "sha": "827efc6d56897b048c772eb4087f854f46256132"
  //   },
  //   "parents": [
  //     {
  //       "url": "",
  //       "sha": ""
  //     }
  //   ],
  //   "verification": {
  //     "verified": false,
  //     "reason": "unsigned",
  //     "signature": null,
  //     "payload": null
  //   }
  // }
}

export async function changeRef(instid, orgname, reponame, branch, newSha) {
  const url = `/github/orgs/${instid}/repos/${orgname}/${reponame}/git/refs/heads/${branch}`
  const options = getOptions({
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sha: newSha,
      force: false
    })
  })
  const result = await request(url, options)
  console.log(`changeRef result: ${JSON.stringify(result)}`)
  return result

  // DEBUG
  // return {
  //   "ref": "refs/heads/hoge",
  //   "url": "https://api.github.com/hoge",
  //   "object": {
  //     "type": "commit",
  //     "sha": "aa218f56b14c9653891f9e74264a383fa43fefbd",
  //     "url": "https://api.github.com/hoge"
  //   }
  // }
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

