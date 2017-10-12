import { fromJS } from 'immutable'
import { createSelector } from 'reselect'
import {
  isRouteAction
} from 'redux/routes/name'
import {
  DB_LOADED
} from 'redux/modules/db'

// Constants
const UPLOAD_IMAGE = 'image/UPLOAD_IMAGE'
const DELETE_IMAGE = 'image/DELETE_IMAGE'
const SET_IMAGE_TAGS = 'image/SET_IMAGE_TAGS'

// Actions
export function uploadImage(id, file, meta) {
  return {
    type: UPLOAD_IMAGE,
    id,
    file,
    meta
  }
}

export function deleteImage(id) {
  return {
    type: DELETE_IMAGE,
    id
  }
}

export function setImageTags(id, tags) {
  return {
    type: SET_IMAGE_TAGS,
    id,
    tags
  }
}

// Utility functions
export async function isValidImageFile(file) {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onerror = (err) => {
        console.error(err)
        resolve(false)
      }
      img.onload = () => {
        resolve(true)
      }
      img.src = url
    } catch (err) {
      console.error(err)
      resolve(false)
    }
  })
}

// Selector
export const selectImage = (state) => state.get('image')
export const selectImageId = createSelector(
  selectImage,
  (state) => state.get('selected')
)
export const selectImageFiles = createSelector(
  selectImage,
  (state) => state.get('files').filter((file) => (file.getIn(['meta', 'deleted']) !== true))
)
export const selectAllImageIds = createSelector(
  selectImageFiles,
  (files) => [...files.keys()]
)
export const selectAllImageTags = createSelector(
  selectImageFiles,
  (files) => {
    const tagSet = files.reduce((set, data) => {
      const tags = data.getIn(['meta', 'tags'])
      if (tags) {
        tags.forEach((tag) => set.add(tag))
      }
      return set
    }, new Set())
    return [...tagSet.values()]
  }
)
export const selectImageData = createSelector(
  selectImageId, selectImageFiles,
  (id, files) => files.get(id)
)
export const selectImageInfo = createSelector(
  selectImageData,
  (data) => (data ? data.get('meta') : null)
)
export const selectImageFile = createSelector(
  selectImageData,
  (data) => (data ? data.get('file') : null)
)
export const selectImageUrl = createSelector(
  selectImageFile,
  (file) => (file ? URL.createObjectURL(file) : null)
)
export const makeSelectImageData = (id) => createSelector(
  selectImageFiles,
  (state) => state.get(id)
)
export const makeSelectImageInfo = (id) => createSelector(
  makeSelectImageData(id),
  (data) => (data ? data.get('meta') : null)
)
export const makeSelectImageFile = (id) => createSelector(
  makeSelectImageData(id),
  (data) => (data ? data.get('file') : null)
)
export const makeSelectImageUrl = (id) => createSelector(
  makeSelectImageFile(id),
  (file) => (file ? URL.createObjectURL(file) : null)
)

// Initial State
const initialState = fromJS({
  selected: '',
  files: {}
})

// Reducer
const parseDBData = (state, data) => {
  const arr = data.files['data.json'].content.images
  const updated = {}
  arr.forEach((json) => { updated[json.id] = json.updated_at })
  const imageData = Object.values(data.files).filter((file) => file.category === 'images')
  const files = {}
  const jsons = {}
  const deleted = {}
  imageData.forEach((file) => {
    if (file.dir) {
      if (file.deleted) {
        deleted[file.id] = true
      }
      return
    }
    if (file.name === 'image.json') {
      jsons[file.id] = file.content
    } else {
      files[file.path] = file.content
    }
  })
  const images = {}
  Object.keys(jsons).forEach((id) => {
    if (deleted[id]) {
      return
    }
    const json = jsons[id]
    json.updated = updated[id]
    const path = `images/${id}/${json.path}`
    const image = files[path]
    images[id] = {
      file: image,
      meta: json
    }
  })
  return state.set('files', fromJS(images))
}

export default function reducer(state = initialState, action) {
  if (isRouteAction(action.type)) {
    return state.set('selected', action.payload.imageid)
  }

  switch (action.type) {
    case DB_LOADED:
      return parseDBData(state, action.data)

    case UPLOAD_IMAGE: {
      const meta = action.meta || {
        path: action.file.name,
        updated: (new Date()).toISOString(),
        tags: []
      }

      const image = fromJS({
        file: action.file,
        meta
      })

      return state.setIn(['files', action.id], image)
    }

    case SET_IMAGE_TAGS: {
      const tags = fromJS(action.tags)
      return state.setIn(['files', action.id, 'meta', 'tags'], tags)
    }

    case DELETE_IMAGE: {
      const image = state.getIn(['files', action.id])
      if (!image) {
        return state
      }
      console.log(`image module DELETE ${action.id}`)
      return state.setIn(['files', action.id, 'meta', 'deleted'], true)
    }

    default:
      return state
  }
}

