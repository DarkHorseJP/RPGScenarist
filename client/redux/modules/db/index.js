import { fromJS } from 'immutable'
import { createSelector } from 'reselect'
import {
  createBlob,
  createTree,
  createCommit,
  changeRef,
  getHeadSha
} from 'redux/modules/github'

// Constants
export const DB_LOADED = 'db/DB_LOADED'
export const COMMIT_EDIT_DB = 'db/COMMIT_EDIT_DB'
export const FINISH_EDIT_DB = 'db/FINISH_EDIT_DB'
export const UPLOAD_ASSET = 'db/UPLOAD_ASSET'
export const DELETE_ASSET = 'db/DELETE_ASSET'
export const SET_ASSET_TAGS = 'db/SET_ASSET_TAGS'

// const DB_STATE_LOADING = 'loading'
const DB_STATE_SAVING = 'saving'
const DB_STATE_UP_TO_DATE = 'upToDate'
const DB_STATE_EDITED = 'edited'

// Actions
export function dbLoaded(instid, data) {
  return {
    type: DB_LOADED,
    instid,
    data
  }
}

export function commitEditDb(next) {
  return {
    type: COMMIT_EDIT_DB,
    next
  }
}

export function finishEditDb() {
  return {
    type: FINISH_EDIT_DB
  }
}

export async function getResult(request) {
  const promise = new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result)
    }
    request.onerror = () => {
      reject(request.error)
    }
  })
  return promise
}

export async function getAllResults(requests) {
  const promises = requests.map(getResult)
  return Promise.all(promises)
}

export async function waitTransaction(transaction) {
  const t = transaction
  const promise = new Promise((resolve, reject) => {
    t.oncomplete = () => {
      resolve()
    }
    t.onerror = () => {
      reject(t.error)
    }
    t.onabort = () => {
      reject(t.error)
    }
  })
  return promise
}


export async function deleteDB(owner, repo, user, type = 'orig') {
  const dbName = `RPGScenarist/${owner}/${repo}/${user}/${type}`
  console.warn(`delete: ${dbName}`)
  const request = window.indexedDB.deleteDatabase(dbName)
  return getResult(request)
}

export async function getDB(owner, repo, user, type = 'orig') {
  const dbName = `RPGScenarist/${owner}/${repo}/${user}/${type}`
  const version = 1
  const option = version
  if (navigator.storage && navigator.storage.persist) {
    // Chrome
    await navigator.storage.persist()
    // await navigator.storage.persisted()
    // }else{
    // Firefox
    // option = { version, storage: 'persist' }
  }
  const request = window.indexedDB.open(dbName, option)
  request.onupgradeneeded = () => {
    console.log('upgrade needed')
    const db = request.result

    const filesStore = db.createObjectStore('files', { keyPath: 'path' })
    filesStore.createIndex('category', 'category', { unique: false })
    filesStore.createIndex('id', ['category', 'id'], { unique: false })

    db.createObjectStore('meta', { keyPath: 'key' })
    console.log('upgrade needed done')
  }
  return getResult(request)
}

export async function getAllRecords(owner, repo, user, type = 'orig') {
  const db = await getDB(owner, repo, user, type)
  if (!db) {
    console.error('db is null')
    return null
  }
  const obj = {}
  const stores = ['files', 'meta']
  const keys = { files: 'path', meta: 'key' }
  const transaction = db.transaction(stores, 'readonly')

  const promises = []
  stores.forEach((storeName) => {
    const store = transaction.objectStore(storeName)
    promises.push(getResult(store.getAll()))
  })

  const results = await Promise.all(promises)
  for (let i = 0; i < results.length; i += 1) {
    const records = results[i]
    const storeName = stores[i]
    const keyName = keys[storeName]
    const data = {}
    records.forEach((record) => {
      data[record[keyName]] = record
    })
    obj[storeName] = data
  }

  return obj
}

export async function restoreData(owner, repo, user) {
  console.log('restoreData')
  const data = await getAllRecords(owner, repo, user, 'orig')
  if (!data) {
    console.error('restoreData: data is null')
    return null
  }
  const editData = await getAllRecords(owner, repo, user, 'edit')
  if (editData) {
    Object.keys(data).forEach((key) => {
      Object.assign(data[key], editData[key])
    })
  }
  console.log('restoreData done')
  return data
}

export async function parseZipData(zip, owner, repo, user) {
  console.log('parseZipData')
  const dirPattern = RegExp(`^${owner}-${repo}-([0-9a-f]+)/$`)
  const dirname = Object.keys(zip.files).find((name) => dirPattern.test(name))
  if (!dirname) {
    throw new Error('zip dirName error')
  }
  const hash = dirPattern.exec(dirname)[1]
  const filePattern = RegExp(`^${dirname}([^/]+)/([^/]+)/(.*)$`)
  const modelDirectory = `${dirname}/models`

  const promises = Object.keys(zip.files)
    .filter((fileName) => {
      if (!fileName.startsWith(dirname)) {
        console.error(`file pattern unmatch: ${fileName}`)
        return false
      }
      if (fileName === dirname) {
        return false
      }
      if (fileName.startsWith(modelDirectory)) {
        // Model data is too large to store in the local db.
        if (fileName.endsWith('/data.json')) {
          return true
        }
        return false
      }
      return true
    })
    .map((fileName) => {
      const path = fileName.substring(dirname.length)
      let category = null
      let id = null
      let name = null
      const result = filePattern.exec(fileName)
      if (result !== null) {
        category = result[1]
        id = result[2]
        name = result[3]
      }
      const file = zip.file(fileName)
      const isDir = (file === null || file.dir)
      /*
      const shaPath = isDir ? path.substring(0, path.length - 1) : path
      const sha = shaData[shaPath]
      if(!sha){
        console.error(`could not find sha value: ${path}`)
      }
      */
      let contentPromise = Promise.resolve(null)
      if (!isDir) {
        if (fileName.endsWith('.json')) {
          contentPromise = file.async('string').then(JSON.parse)
            .catch((err) => { console.error(`${fileName}:${err}`) })
        } else {
          contentPromise = file.async('blob')
        }
      }
      return contentPromise.then((content) => ({
        path,
        dir: isDir,
        category,
        id,
        name,
        content
      }))
    })
  const fileArray = await Promise.all(promises)

  const db = await getDB(owner, repo, user, 'orig')
  const transaction = db.transaction(['files', 'meta'], 'readwrite')
  const filesStore = transaction.objectStore('files')
  fileArray.forEach((file) => {
    filesStore.put(file)
  })
  const metaStore = transaction.objectStore('meta')
  metaStore.put({ key: 'sha', value: hash })
  metaStore.put({ key: 'owner', value: owner })
  metaStore.put({ key: 'repo', value: repo })
  metaStore.put({ key: 'user', value: user })

  return waitTransaction(transaction)
}

export async function setShaData(owner, repo, user, shaData) {
  const data = await getAllRecords(owner, repo, user, 'orig')
  const fileArray = []
  Object.keys(shaData).forEach((path) => {
    const sha = shaData[path]
    console.log(`setShaData: ${path}: ${sha}`)
    const fileData = data.files[path]
    if (!fileData) {
      console.error(`file data not found: ${path}`)
      return
    }
    fileData.sha = sha
    fileArray.push(fileData)
  })

  const db = await getDB(owner, repo, user, 'orig')
  const transaction = db.transaction(['files', 'meta'], 'readwrite')
  const filesStore = transaction.objectStore('files')
  fileArray.forEach((file) => {
    filesStore.put(file)
  })

  const commitHash = shaData['/']
  const metaStore = transaction.objectStore('meta')
  metaStore.put({ key: 'sha', value: commitHash })

  return waitTransaction(transaction)
}

export async function hasEditData(owner, repo, user) {
  const db = await getDB(owner, repo, user, 'edit')
  return db !== null
}

const createOrigTree = (data) => {
  const files = data.files
  const tree = { sha: 'root', edited: false, dir: true, children: {} }
  Object.keys(files).forEach((path) => {
    const file = files[path]
    const dirs = path.split('/')
    let dirObj = tree
    dirs.forEach((dir) => {
      if (dir === '') {
        return
      }
      if (!dirObj.children[dir]) {
        dirObj.children[dir] = { sha: null, edited: false, dir: true, children: {} }
      }
      dirObj = dirObj.children[dir]
    })
    dirObj.dir = file.dir
    dirObj.sha = file.sha
  })
  return tree
}

const deleteFromTree = (tree, path) => {
  const dirs = path.split('/')
  if (dirs[dirs.length - 1] === '') {
    dirs.pop()
  }
  const deletedFile = dirs.pop()

  let dirObj = tree
  dirs.forEach((dir) => {
    if (!dirObj) {
      return
    }
    dirObj.edited = true
    dirObj = dirObj.children[dir]
  })
  if (dirObj) {
    delete dirObj.children[deletedFile]
  }
}

const addBlobToTree = (tree, path, sha) => {
  const dirs = path.split('/')
  if (dirs[dirs.length - 1] === '') {
    dirs.pop()
  }

  let dirObj = tree
  dirs.forEach((dir) => {
    if (dir === '') {
      console.log('dir === empty')
      return
    }
    if (!dirObj.children[dir]) {
      dirObj.children[dir] = { sha: null, edited: true, dir: true, children: {} }
    }
    dirObj.edited = true
    dirObj = dirObj.children[dir]
  })
  dirObj.edited = true
  dirObj.dir = false
  dirObj.sha = sha
}

async function createTreeRecursive(instid, owner, repo, tree, currentPath, updatedFiles) {
  console.log(`createTrees: ${JSON.stringify(tree)}`)
  // createTree(instid, owner, repo, files, (baseTreeSha))
  if (!tree.dir || !tree.edited || tree.deleted) {
    return null
  }
  if (tree.children.length <= 0) {
    tree.deleted = true // eslint-disable-line no-param-reassign
    return null
  }

  const promises = Object.keys(tree.children).map((path) => {
    const child = tree.children[path]
    const childPath = `${currentPath}${path}/`
    return createTreeRecursive(instid, owner, repo, child, childPath, updatedFiles)
  })
  await Promise.all(promises)

  const files = Object.keys(tree.children)
    .filter((path) => !tree.children[path].deleted)
    .map((path) => {
      const child = tree.children[path]
      const mode = (child.dir ? '040000' : '100644')
      const type = (child.dir ? 'tree' : 'blob')
      const sha = child.sha

      return {
        path,
        mode,
        type,
        sha
      }
    })

  if (files.length <= 0) {
    tree.deleted = true // eslint-disable-line no-param-reassign
    return null
  }

  return createTree(instid, owner, repo, files)
    .then((result) => {
      console.log(`createTree: oldSha: ${tree.sha}, newSha: ${result.sha}`)
      console.log(`createTreeResult: ${JSON.stringify(result)}`)
      tree.sha = result.sha // eslint-disable-line no-param-reassign

      const paths = currentPath.split('/')
      let category = null
      let id = null
      let name = null
      if (paths.length >= 3) {
        category = paths.shift()
        id = paths.shift()
        name = paths.join('/')
      }

      updatedFiles[currentPath] = { // eslint-disable-line no-param-reassign
        path: currentPath,
        dir: true,
        category,
        id,
        name,
        content: null
      }
    })
}

export async function commitEditData(instid, owner, repo, user) {
  console.log(`commitEditData ${instid} ${owner} ${repo} ${user}`)
  // TODO: check db data is up to date.
  const headSha = await getHeadSha(instid, owner, repo, `user/${user}`)
  console.log(`headSha: ${headSha}`)
  const editData = await getAllRecords(owner, repo, user, 'edit')
  if (!editData || Object.keys(editData.files).length <= 0) {
    console.warn('editData is empty')
    // there's no edit data
    return
  }
  const editDb = await getDB(owner, repo, user, 'edit')
  const transaction = editDb.transaction(['files'], 'readwrite')
  const filesStore = transaction.objectStore('files')
  Object.keys(editData.files).forEach((path) => {
    const fileObj = editData.files[path]
    const savingObj = Object.assign({ saving: true }, fileObj)
    filesStore.put(savingObj)
  })

  const origData = await getAllRecords(owner, repo, user, 'orig')
  const tree = createOrigTree(origData)
  console.log('createOrigTree done')

  const deletedFiles = []
  const updatedFiles = {}
  const promises = Object.keys(editData.files).map((path) => {
    const fileObj = editData.files[path]
    if (fileObj.deleted) {
      deleteFromTree(tree, path)
      deletedFiles.push(path)
      return null
    }
    if (fileObj.dir) {
      return null
    }
    const content = fileObj.content
    let isBlob = true
    if (typeof content === 'string') {
      isBlob = false
    } else if (path.endsWith('.json')) {
      isBlob = false
    }

    return createBlob(instid, owner, repo, content, isBlob)
      .then((result) => {
        console.log(`createBlob then reseult.sha: ${result.sha}`)
        addBlobToTree(tree, path, result.sha)
        const paths = path.split('/')
        let category = null
        let id = null
        let name = null
        if (paths.length >= 3) {
          category = paths.shift()
          id = paths.shift()
          name = paths.join('/')
        }

        updatedFiles[path] = {
          path,
          dir: false,
          category,
          id,
          name,
          content
        }
      })
  })
  console.log('createBlob done')
  console.log(`promises: ${JSON.stringify(promises)}`)
  await Promise.all(promises)
  console.log('Promise.all(promises) done')
  await createTreeRecursive(instid, owner, repo, tree, '', updatedFiles)
  console.log('createTreeRecursive')

  const commitResult = await createCommit(instid, owner, repo, user, tree.sha, headSha)
  const commitHash = commitResult.sha
  await changeRef(instid, owner, repo, `user/${user}`, commitHash)
  console.log('changeRef')

  console.warn(`updatedFiles: ${JSON.stringify(updatedFiles)}`)

  const origDb = await getDB(owner, repo, user, 'orig')
  const origTransaction = origDb.transaction(['files', 'meta'], 'readwrite')

  const metaStore = origTransaction.objectStore('meta')
  metaStore.put({ key: 'sha', value: commitHash })

  console.log('1')

  const origFilesStore = origTransaction.objectStore('files')
  Object.keys(updatedFiles).forEach((path) => {
    const file = updatedFiles[path]
    origFilesStore.put(file)
  })
  deletedFiles.forEach((fileName) => {
    origFilesStore.delete(fileName)
  })

  console.log('2')

  const newEditData = await getAllRecords(owner, repo, user, 'edit')
  const editTransaction = editDb.transaction(['files'], 'readwrite')
  const editFilesStore = editTransaction.objectStore('files')
  Object.keys(newEditData.files).forEach((path) => {
    const file = newEditData.files[path]
    if (file.saving) {
      editFilesStore.delete(path)
    }
  })
  console.log('3')
  // await waitTransaction(origTransaction)
  console.log('4')
  await waitTransaction(editTransaction)
  console.log('all done')
}

const isDeleted = (file) => {
  if (!file) {
    return true
  }
  console.log(`file.deleted: ${file.deleted}`)
  return file.deleted === true
}

export async function getFile(owner, repo, user, path) {
  console.log(`getFile path: ${path}`)
  const editDb = await getDB(owner, repo, user, 'edit')
  const editTransaction = editDb.transaction(['files'], 'readonly')
  const editFilesStore = editTransaction.objectStore('files')
  const file = await getResult(editFilesStore.get(path))
  console.log(`edit file: ${file}`)
  if (!isDeleted(file)) {
    console.log('get data from editDB')
    return file
  }

  const origDb = await getDB(owner, repo, user, 'orig')
  const origTransaction = origDb.transaction(['files'], 'readonly')
  const origFilesStore = origTransaction.objectStore('files')
  return getResult(origFilesStore.get(path))
  // const result = await getResult(origFilesStore.get(path))
  // console.log(`org file: ${result}`)
  // return result
}

/*
export async function getFilesById(owner, repo, user, category, id) {
  const editDb = await getDB(owner, repo, user, 'edit')
  const editTransaction = editDb.transaction(['files'], 'readonly')
  const editFilesStore = editTransaction.objectStore('files')
  const editFiles = await getResult(editFilesStore.get(   ))

  const origDb = await getDB(owner, repo, user, 'orig')
  const origTransaction = origDb.transaction(['files'], 'readonly')
  const origFilesStore = origTransaction.objectStore('files')
  const files = await getResult(origFilesStore.get(   ))
}
*/

export async function putData(owner, repo, user, category, id) {
  const jsonData = await getFile(owner, repo, user, 'data.json')
  const db = await getDB(owner, repo, user, 'edit')
  const transaction = db.transaction(['files'], 'readwrite')
  const filesStore = transaction.objectStore('files')

  const prevDate = new Date(jsonData.content.updated_at)
  const now = new Date()
  if (prevDate > now) {
    throw new Error(`updated_at error ${prevDate} > ${now}`)
  }
  const updatedAt = now.toISOString()
  jsonData.content.updated_at = updatedAt
  if (jsonData.content[category][id]) {
    jsonData.content[category][id].updated_at = updatedAt
  } else {
    jsonData.content[category].push({ id, updated_at: updatedAt })
    jsonData.content[category].sort((a, b) => {
      if (a.id > b.id) {
        return 1
      }
      if (a.id < b.id) {
        return -1
      }
      return 0
    })
  }
  filesStore.put(jsonData)
  return waitTransaction(transaction)
}

export async function deleteData(owner, repo, user, category, id) {
  console.log('deleteData')
  // const origData = await getAllRecords(owner, repo, user, 'orig')
  const db = await getDB(owner, repo, user, 'edit')
  const transaction = db.transaction(['files'], 'readwrite')
  const filesStore = transaction.objectStore('files')
  const now = new Date()

  const jsonData = await getFile(owner, repo, user, 'data.json')
  if (jsonData.content[category][id]) {
    const prevDate = new Date(jsonData.content.updated_at)
    if (prevDate > now) {
      throw new Error(`updated_at error ${prevDate} > ${now}`)
    }
    const updatedAt = now.toISOString()
    jsonData.content.updated_at = updatedAt
    delete jsonData.content[category][id]
    filesStore.put(jsonData)
  }

  return waitTransaction(transaction)
}

export async function setAsset(owner, repo, user, category, id, file) {
  const jsonFilePath = `${category}/${id}/data.json`
  const origData = await getFile(owner, repo, user, jsonFilePath)
  const db = await getDB(owner, repo, user, 'edit')
  const transaction = db.transaction(['files'], 'readwrite')
  const filesStore = transaction.objectStore('files')

  putData(owner, repo, user, category, id)

  const dirPath = `${category}/${id}`
  filesStore.put({
    path: dirPath,
    dir: true,
    category,
    id,
    name: '',
    content: null
  })

  let jsonContent = {
    path: file.name,
    tags: []
  }

  if (origData) {
    jsonContent = origData.content
    jsonContent.path = file.name
  }
  filesStore.put({
    path: jsonFilePath,
    dir: false,
    category,
    id,
    name: 'data.json',
    content: jsonContent
  })

  const path = `${category}/${id}/${file.name}`
  filesStore.put({
    path,
    dir: false,
    category,
    id,
    name: file.name,
    content: file
  })

  return waitTransaction(transaction)
}

export async function setAssetTags(owner, repo, user, category, id, tags) {
  const jsonFilePath = `${category}/${id}/data.json`
  const data = await getFile(owner, repo, user, jsonFilePath)

  if (!data) {
    console.error(`file not found: ${jsonFilePath}`)
    return null
  }

  data.content.tags = tags

  const db = await getDB(owner, repo, user, 'edit')
  const transaction = db.transaction(['files'], 'readwrite')
  const filesStore = transaction.objectStore('files')
  filesStore.put({
    path: jsonFilePath,
    dir: false,
    category,
    id,
    name: 'data.json',
    content: data.content
  })

  return waitTransaction(transaction)
}

export async function deleteAsset(owner, repo, user, category, id) {
  const dirPath = `${category}/${id}/`
  // const origData = await getFile(owner, repo, user, dirPath)
  deleteData(owner, repo, user, category, id)

  const origData = await getAllRecords(owner, repo, user, 'orig')
  const deletedFiles = Object.keys(origData.files).filter((path) => path.startsWith(dirPath))
  console.log(`deletedFiles: ${JSON.stringify(deletedFiles)}`)
  const db = await getDB(owner, repo, user, 'edit')
  const transaction = db.transaction(['files'], 'readwrite')
  const filesStore = transaction.objectStore('files')

  deletedFiles.forEach((path) => {
    const deletedFile = origData.files[path]
    deletedFile.deleted = true
    filesStore.put(deletedFile)
  })

  return waitTransaction(transaction)
}


// Selector
export const selectDb = (state) => state.get('db')
export const selectInstallationId = createSelector(
  selectDb,
  (state) => state.get('instid')
)
export const selectOwner = createSelector(
  selectDb,
  (state) => state.get('owner')
)
export const selectRepo = createSelector(
  selectDb,
  (state) => state.get('repo')
)
export const selectUser = createSelector(
  selectDb,
  (state) => state.get('user')
)
export const selectSha = createSelector(
  selectDb,
  (state) => state.get('sha')
)
export const selectState = createSelector(
  selectDb,
  (state) => state.get('state')
)

// Initial State
const initialState = fromJS({
  instid: '',
  owner: '',
  repo: '',
  user: '',
  sha: '',
  state: ''
})

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case DB_LOADED:
      return state.withMutations((s) => {
        s.set('instid', action.instid)
        Object.keys(action.data.meta).forEach((key) => {
          s.set(key, action.data.meta[key].value)
        })
      })

    case COMMIT_EDIT_DB: {
      const instid = state.get('instid')
      const owner = state.get('owner')
      const repo = state.get('repo')
      const user = state.get('user')
      const newState = state.set('state', DB_STATE_SAVING)
      commitEditData(instid, owner, repo, user)
        .then(() => {
          console.log('next')
          action.next({ ok: true })
        })
        .catch((err) => {
          console.log(`error: ${err}`)
          action.next({ error: err })
        })
      return newState
    }

    case FINISH_EDIT_DB:
      // FIXME: check db state
      return state.set('state', DB_STATE_UP_TO_DATE)

    case UPLOAD_ASSET:
      setAsset(
        state.get('owner'),
        state.get('repo'),
        state.get('user'),
        action.category,
        action.id,
        action.file
      )
      if (state.get('state') === DB_STATE_SAVING) {
        return state
      }
      return state.set('state', DB_STATE_EDITED)

    case DELETE_ASSET:
      deleteAsset(
        state.get('owner'),
        state.get('repo'),
        state.get('user'),
        action.category,
        action.id
      )
      if (state.get('state') === DB_STATE_SAVING) {
        return state
      }
      return state.set('state', DB_STATE_EDITED)

    case SET_ASSET_TAGS:
      setAssetTags(
        state.get('owner'),
        state.get('repo'),
        state.get('user'),
        action.category,
        action.id,
        action.tags
      )
      if (state.get('state') === DB_STATE_SAVING) {
        return state
      }
      return state.set('state', DB_STATE_EDITED)

    default:
      return state
  }
}

