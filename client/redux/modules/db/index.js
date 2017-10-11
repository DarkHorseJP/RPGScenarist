import { fromJS } from 'immutable'
import { createSelector } from 'reselect'

// Constants
export const DB_LOADED = 'db/DB_LOADED'

// FIXME: ref to modules/image
const UPLOAD_IMAGE = 'image/UPLOAD_IMAGE'
const DELETE_IMAGE = 'image/DELETE_IMAGE'
const SET_IMAGE_TAGS = 'image/SET_IMAGE_TAGS'

// Actions
export function dbLoaded(data) {
  return {
    type: DB_LOADED,
    data
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


// for debug
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

  const promises = Object.keys(zip.files)
    .filter((fileName) => {
      if (!fileName.startsWith(dirname)) {
        console.error(`file pattern unmatch: ${fileName}`)
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
      let contentPromise = Promise.resolve(null)
      if (!isDir) {
        if (fileName.endsWith('.json')) {
          contentPromise = file.async('string').then(JSON.parse)
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

  const db = await getDB(owner, repo, user)
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

export async function hasEditData(owner, repo, user) {
  const db = await getDB(owner, repo, user, 'edit')
  return db !== null
}

const isDeleted = (file) => {
  if (!file) {
    return true
  }
  console.log(`file.deleted: ${file.deleted}`)
  return file.deleted === true
}

export async function getFile(owner, repo, user, path) {
  const editDb = await getDB(owner, repo, user, 'edit')
  const editTransaction = editDb.transaction(['files'], 'readonly')
  const editFilesStore = editTransaction.objectStore('files')
  const file = await getResult(editFilesStore.get(path))
  console.log(`edit file: ${file}`)
  if (!isDeleted(file)) {
    return file
  }

  const origDb = await getDB(owner, repo, user, 'orig')
  const origTransaction = origDb.transaction(['files'], 'readonly')
  const origFilesStore = origTransaction.objectStore('files')
  // return getResult(origFilesStore.get(path))
  const result = await getResult(origFilesStore.get(path))
  console.log(`org file: ${result}`)
  return result
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
  const jsonData = await getFile(owner, repo, user, 'data.json')
  if (!jsonData.content[category][id]) {
    return null
  }
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
  delete jsonData.content[category][id]
  filesStore.put(jsonData)
  return waitTransaction(transaction)
}

export async function setImage(owner, repo, user, id, file) {
  const imageJsonFilePath = `images/${id}/image.json`
  const origImageData = await getFile(owner, repo, user, imageJsonFilePath)
  const db = await getDB(owner, repo, user, 'edit')
  const transaction = db.transaction(['files'], 'readwrite')
  const filesStore = transaction.objectStore('files')

  putData(owner, repo, user, 'images', id)

  const dirPath = `images/${id}`
  filesStore.put({
    path: dirPath,
    dir: true,
    category: 'images',
    id,
    name: '',
    content: null
  })

  let jsonContent = {
    path: file.name,
    tags: []
  }

  if (origImageData) {
    jsonContent = origImageData.content
    jsonContent.path = file.name
  }
  filesStore.put({
    path: imageJsonFilePath,
    dir: false,
    category: 'images',
    id,
    name: 'image.json',
    content: jsonContent
  })

  const imagePath = `images/${id}/${file.name}`
  filesStore.put({
    path: imagePath,
    dir: false,
    category: 'images',
    id,
    name: file.name,
    content: file
  })

  return waitTransaction(transaction)
}

export async function setImageTags(owner, repo, user, id, tags) {
  const jsonFilePath = `images/${id}/image.json`
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
    category: 'images',
    id,
    name: 'image.json',
    content: data.content
  })

  return waitTransaction(transaction)
}

export async function deleteImage(owner, repo, user, id) {
  const dirPath = `images/${id}`
  const origData = await getFile(owner, repo, user, dirPath)
  if (!origData) {
    return null
  }

  deleteData(owner, repo, user, 'images', id)

  const db = await getDB(owner, repo, user, 'edit')
  const transaction = db.transaction(['files'], 'readwrite')
  const filesStore = transaction.objectStore('files')
  origData.deleted = true
  console.log(`deleted origData: ${JSON.stringify(origData)}`)
  filesStore.put(origData)

  return waitTransaction(transaction)
}


// Selector
export const selectDb = (state) => state.get('db')
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

// Initial State
const initialState = fromJS({
  owner: '',
  repo: '',
  user: '',
  sha: ''
})

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case DB_LOADED:
      return state.withMutations((s) => {
        Object.keys(action.data.meta).forEach((key) => {
          s.set(key, action.data.meta[key].value)
        })
      })

    case UPLOAD_IMAGE:
      setImage(
        state.get('owner'),
        state.get('repo'),
        state.get('user'),
        action.id,
        action.file
      )
      return state

    case DELETE_IMAGE:
      deleteImage(
        state.get('owner'),
        state.get('repo'),
        state.get('user'),
        action.id
      )
      return state

    case SET_IMAGE_TAGS:
      setImageTags(
        state.get('owner'),
        state.get('repo'),
        state.get('user'),
        action.id,
        action.tags
      )

      return state

    default:
      return state
  }
}

