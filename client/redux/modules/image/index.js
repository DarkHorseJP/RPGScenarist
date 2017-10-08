import { fromJS } from 'immutable'
import { createSelector } from 'reselect'
import {
  ROUTE_IMAGE_EDIT
} from 'redux/routes/name'
import {
  DB_LOADED
} from 'redux/modules/db'

// Constants

// Actions

// Selector
export const selectImage = (state) => state.get('image')
export const selectImageId = createSelector(
  selectImage,
  (state) => state.get('id')
)
export const selectImageFiles = createSelector(
  selectImage,
  (state) => state.get('files')
)
export const makeSelectImageUrl = (id) => createSelector(
  selectImageFiles,
  (state) => {
    const file = state.get(id)
    if (!file) {
      return null
    }
    return URL.createObjectURL(file)
  }
)

// Initial State
const initialState = fromJS({
  selected: '',
  files: {}
})

// Reducer
const parseDBData = (state, data) => {
  const imageData = Object.values(data.files).filter((file) => file.category === 'images')
  const files = {}
  const jsons = {}
  imageData.forEach((file) => {
    if (file.dir) {
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
    const json = jsons[id]
    const path = `images/${id}/${json.path}`
    const image = files[path]
    images[id] = image
  })
  return state.set('files', fromJS(images))
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ROUTE_IMAGE_EDIT:
      return state.set('selected', action.payload.imageid)

    case DB_LOADED:
      // console.log('action: ' + Object.keys(action))
      return parseDBData(state, action.data)

    default:
      return state
  }
}

