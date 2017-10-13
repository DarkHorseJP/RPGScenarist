import { fromJS } from 'immutable'
import { createSelector } from 'reselect'
import {
  isRouteAction
} from 'redux/routes/name'
import {
  DB_LOADED,
  UPLOAD_ASSET,
  DELETE_ASSET,
  SET_ASSET_TAGS
} from 'redux/modules/db'

// Actions
export function uploadAsset(category, id, file, meta) {
  return {
    type: UPLOAD_ASSET,
    category,
    id,
    file,
    meta
  }
}

export function deleteAsset(category, id) {
  return {
    type: DELETE_ASSET,
    category,
    id
  }
}

export function setAssetTags(category, id, tags) {
  return {
    type: SET_ASSET_TAGS,
    category,
    id,
    tags
  }
}

// Selector
export const makeSelectors = (name) => {
  const selectAsset = (state) => state.get(name)
  const selectId = createSelector(
    selectAsset,
    (state) => state.get('selected')
  )
  const selectFiles = createSelector(
    selectAsset,
    (state) => state.get('files').filter((file) => (file.getIn(['meta', 'deleted']) !== true))
  )
  const selectAllIds = createSelector(
    selectFiles,
    (files) => [...files.keys()]
  )
  const selectAllTags = createSelector(
    selectFiles,
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
  const selectData = createSelector(
    selectId, selectFiles,
    (id, files) => files.get(id)
  )
  const selectInfo = createSelector(
    selectData,
    (data) => (data ? data.get('meta') : null)
  )
  const selectFile = createSelector(
    selectData,
    (data) => (data ? data.get('file') : null)
  )
  const selectUrl = createSelector(
    selectFile,
    (file) => (file ? URL.createObjectURL(file) : null)
  )
  const makeSelectData = (id) => createSelector(
    selectFiles,
    (state) => state.get(id)
  )
  const makeSelectInfo = (id) => createSelector(
    makeSelectData(id),
    (data) => (data ? data.get('meta') : null)
  )
  const makeSelectFile = (id) => createSelector(
    makeSelectData(id),
    (data) => (data ? data.get('file') : null)
  )
  const makeSelectUrl = (id) => createSelector(
    makeSelectFile(id),
    (file) => (file ? URL.createObjectURL(file) : null)
  )
  return {
    selectAsset,
    selectId,
    selectFiles,
    selectAllIds,
    selectAllTags,
    selectData,
    selectInfo,
    selectFile,
    selectUrl,
    makeSelectData,
    makeSelectInfo,
    makeSelectFile,
    makeSelectUrl
  }
}

// Reducer
const parseDBData = (state, data, category) => {
  const arr = data.files['data.json'].content[category]
  const updated = {}
  arr.forEach((json) => { updated[json.id] = json.updated_at })
  const accetData = Object.values(data.files).filter((file) => file.category === category)
  const files = {}
  const jsons = {}
  const deleted = {}
  accetData.forEach((file) => {
    if (file.dir) {
      if (file.deleted) {
        deleted[file.id] = true
      }
      return
    }
    if (file.name === 'data.json') {
      jsons[file.id] = file.content
    } else {
      files[file.path] = file.content
    }
  })
  const accets = {}
  Object.keys(jsons).forEach((id) => {
    if (deleted[id]) {
      return
    }
    const json = jsons[id]
    json.updated = updated[id]
    const path = `${category}/${id}/${json.path}`
    const accet = files[path]
    accets[id] = {
      file: accet,
      meta: json
    }
  })
  return state.set('files', fromJS(accets))
}

export const makeReducer = (category, idName) => {
  const initialState = fromJS({
    selected: '',
    files: {}
  })
  return (state = initialState, action) => {
    if (isRouteAction(action.type)) {
      return state.set('selected', action.payload[idName])
    }

    switch (action.type) {
      case DB_LOADED:
        return parseDBData(state, action.data, category)

      case UPLOAD_ASSET: {
        if (action.category !== category) {
          return state
        }
        const meta = action.meta || {
          path: action.file.name,
          updated: (new Date()).toISOString(),
          tags: []
        }

        const accet = fromJS({
          file: action.file,
          meta
        })

        return state.setIn(['files', action.id], accet)
      }

      case SET_ASSET_TAGS: {
        if (action.category !== category) {
          return state
        }
        const tags = fromJS(action.tags)
        return state.setIn(['files', action.id, 'meta', 'tags'], tags)
      }

      case DELETE_ASSET: {
        if (action.category !== category) {
          return state
        }
        const accet = state.getIn(['files', action.id])
        if (!accet) {
          return state
        }
        console.log(`${category} module DELETE ${action.id}`)
        return state.setIn(['files', action.id, 'meta', 'deleted'], true)
      }

      default:
        return state
    }
  }
}

