import { fromJS } from 'immutable'
import { createSelector } from 'reselect'

// Constants
export const DB_LOADED = 'db/DB_LOADED'

// FIXME: ref to modules/image
const UPLOAD_IMAGE = 'image/UPLOAD_IMAGE'
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

export async function setImage(owner, repo, user, id, file) {
  const db = await getDB(owner, repo, user, 'edit')
  const transaction = db.transaction(['files'], 'readwrite')
  const filesStore = transaction.objectStore('files')

  const dirPath = `images/${id}`
  filesStore.put({
    path: dirPath,
    dir: true,
    category: 'images',
    id,
    name: '',
    content: null
  })

  const jsonFilePath = `images/${id}/image.json`
  const jsonContent = {
    path: file.name
  }
  filesStore.put({
    path: jsonFilePath,
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

/*
export async function setImageTags(owner, repo, user, id, tags) {
  const db = await getDB(owner, repo, user, 'edit')
  const transaction = db.transaction(['files'], 'readwrite')
  const filesStore = transaction.objectStore('files')

  const dirPath = `images/${id}`
  filesStore.put({
    path: dirPath,
    dir: true,
    category: 'images',
    id,
    name: '',
    content: null
  })

  const jsonFilePath = `images/${id}/image.json`
  const jsonContent = {
    path: file.name
  }
  filesStore.put({
    path: jsonFilePath,
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
*/

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

    case SET_IMAGE_TAGS:
      /*
      setImageTags(
        state.get('owner'),
        state.get('repo'),
        state.get('user'),
        action.id,
        action.tags
      )
      */

      return state

    default:
      return state
  }
}

