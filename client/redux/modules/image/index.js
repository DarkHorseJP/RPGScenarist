import { fromJS } from 'immutable'
import { createSelector } from 'reselect'
import {
  ROUTE_IMAGE_EDIT
} from 'redux/routes/name'

import request from 'utils/request'

// Constants
const IMAGES_LOADED = 'image/IMAGES_LOADED'
const IMAGE_LOADED = 'image/IMAGE_LOADED'

// Actions
export function imagesLoaded(images) {
  return {
    type: IMAGES_LOADED,
    images
  }
}

export function imageLoaded(id, props) {
  return {
    type: IMAGE_LOADED,
    id,
    props
  }
}

export async function getImageData(orgname, reponame, id, branch = 'master') {
  const domain = 'rawgit.com'
  const url = `https://${domain}/${orgname}/${reponame}/${branch}/images/${id}/image.json`
  return request(url)
}

// Selector
export const selectImage = (state) => state.get('image')
export const makeSelectImageUrl = (id) => createSelector(
  selectImage,
  (state) => state.getIn([id, 'url'])
)
export const selectImageId = createSelector(
  selectImage,
  (state) => state.get('_selectedId')
)

// Initial State
const initialState = fromJS({
  _selectedId: ''
})

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ROUTE_IMAGE_EDIT:
      return state.set('_selectedId', action.payload.imageid)

    case IMAGES_LOADED:
      return fromJS(action.images)
    case IMAGE_LOADED:
      return state.set(action.id, action.props)

    default:
      return state
  }
}

