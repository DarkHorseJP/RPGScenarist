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

/*
const INITIAL_DIRECTORIES = [
  'effects',
  'images',
  'lang',
  'maps',
  'misc',
  'models',
  'motions',
  'musics',
  'scenes',
  'sounds'
]
*/
const INITIAL_DATA_JSON = `{
  "updated_at": "2000-01-01T00:00:00",
  "effects": [],
  "images": [],
  "lang": [],
  "maps": [],
  "misc": [],
  "models": [],
  "motions": [],
  "musics": [],
  "scenes": [],
  "sounds": []
}`

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

export async function getRepositories(instid) {
  const url = `/github/orgs/${instid}/repos`
  const json = await request(url, getOptions())
  return fromJS(json.repositories)
}

export async function getRepository(instid, repoId) {
  const repositories = getRepositories(instid)
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
    content = data
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
  console.warn(`createTree body: ${JSON.stringify(body)}`)
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
  const requestBody = {
    message,
    tree: treeSha,
    parents: []
  }
  if (parentSha) {
    // requestBody.parents = [parentSha]
    requestBody.parents = parentSha
  }
  console.log(`createCommit body: ${JSON.stringify(requestBody)}`)

  const options = getOptions({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
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

export async function createBranch(instid, owner, repo, branchName, sha) {
  const url = `/github/orgs/${instid}/repos/${owner}/${repo}/git/refs`
  const ref = `refs/heads/${branchName}`
  const options = getOptions({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ref,
      sha
    })
  })
  const result = await request(url, options)
  console.warn(`result: ${JSON.stringify(result)}`)
  return result
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

export async function createRepository(instid, owner, name) {
  const url = `/github/orgs/${instid}/repos/${owner}`
  const options = getOptions({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      auto_init: true
    })
  })
  let result = await request(url, options)
  if (typeof result.id === 'undefined') {
    throw new Error(`createRepository error: ${JSON.strintify(result)}`)
  }
  console.warn(`createRepository result: ${JSON.stringify(result)}`)

  // get sha of master HEAD
  result = await getHeadSha(instid, owner, name, 'master')
  const initSha = result
  if (!initSha) {
    throw new Error(`getHeadSha error: ${JSON.stringify(result)}`)
  }

  // create an empty directory
  /*
  result = await createTree(instid, owner, name, [])
  const emptyDirSha = result.sha
  if (typeof emptyDirSha === 'undefined') {
    // TODO: error handling
    console.error('createTree error: ' + JSON.stringify(result))
    return
  }
  */

  // create data.json
  result = await createBlob(instid, owner, name, INITIAL_DATA_JSON)
  const dataJsonSha = result.sha
  if (typeof dataJsonSha === 'undefined') {
    throw new Error(`createBlob error: ${JSON.stringify(result)}`)
  }

  // create a root directory
  const rootFiles = [
    {
      path: 'data.json',
      mode: '100644',
      type: 'blob',
      sha: dataJsonSha
    }
  ]

  /*
  const dirNames = [
    'images',
    'lang',
    'maps',
    'misc',
    'models',
    'motions',
    'musics',
    'scenes',
    'sounds'
  ]
  dirNames.forEach((name) => {
    rootFiles.push({
      path: name,
      mode: '040000',
      type: 'tree',
      sha: emptyDirSha
    })
  })
  */

  result = await createTree(instid, owner, name, rootFiles)
  const treeSha = result.sha
  if (typeof treeSha === 'undefined') {
    throw new Error(`createTree error: ${JSON.stringify(result)}`)
  }

  // commit
  const userName = null
  result = await createCommit(instid, owner, name, userName, treeSha, initSha, 'Initial commit')
  const newSha = result.sha
  if (typeof newSha === 'undefined') {
    throw new Error(`createCommit error: ${treeSha}`)
  }

  // change master HEAD to the new commit
  result = await changeRef(instid, owner, name, 'master', newSha)

  // create 'develop' branch
  result = await createBranch(instid, owner, name, 'develop', newSha)

  return result
}

export async function setRepositoryInfo(instid, owner, repo, name, desc) {
  const url = `/github/orgs/${instid}/repos/${owner}/${repo}`
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
  // console.warn('result: ' + JSON.stringify(result))
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

