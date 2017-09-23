import { fromJS } from 'immutable'
import { createSelector } from 'reselect'

import request from 'utils/request'

// Constants
const CHANGE_MAP = 'map/CHANGE_MAP'
const MAPS_LOADED = 'map/MAPS_LOADED'
export const LOAD_MAPS = 'map/LOAD_MAPS'

// Actions
export function changeMap(mapId) {
  return {
    type: CHANGE_MAP,
    id: mapId
  }
}

export function mapsLoaded(list) {
  return {
    type: MAPS_LOADED,
    list
  }
}

export function loadMaps() {
  return {
    type: LOAD_MAPS
  }
}

export async function getMaps() {
  const url = 'https://cdn.rawgit.com/magicien/ReactTest2/master/data/maps.json'
  const mapJson = await request(url)
  const mapIds = Object.keys(mapJson)
  const maps = mapIds.map((id) => Object.assign({ id }, mapJson[id]))
  return fromJS(maps)
}

// Selector
export const selectMap = (state) => state.get('map')
export const makeSelectMapList = () => createSelector(
  selectMap,
  (state) => state.get('list')
)
export const makeSelectMapId = () => createSelector(
  selectMap,
  (state) => state.get('id')
)
export const makeSelectMapData = () => createSelector(
  selectMap,
  (state) => ({ id: state.get('id'), name: state.get('name') })
)

// Initial State
const initialState = fromJS({
  list: [],
  id: '',
  name: ''
})

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_MAP:
      return state.set('id', action.id)
    case MAPS_LOADED:
      return state.set('list', action.list)
    default:
      return state
  }
}

