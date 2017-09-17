import { fromJS } from 'immutable'
import { createSelector } from 'reselect'

// Constants
const CHANGE_MODEL = 'model/CHANGE_MODEL'
const MODELS_LOADED = 'map/MODELS_LOADED'
export const LOAD_MODELS = 'map/LOAD_MODELS'

// Actions
export function changeModel(modelId) {
  return {
    type: CHANGE_MODEL,
    id: modelId
  }
}

export function modelsLoaded(list) {
  return {
    type: MODELS_LOADED,
    list: list
  }
}

export function loadModels() {
  return {
    type: LOAD_MODELS
  }
}

// Selector
export const selectModel = (state) => state.get('model')
export const makeSelectModelList = () => createSelector(
  selectModel,
  (state) => state.get('list')
)
export const makeSelectModelId = () => createSelector(
  selectModel,
  (state) => state.get('id')
)
export const makeSelectModelData = () => createSelector(
  selectModel,
  (state) => { return {id: state.get('id'), name: state.get('name')} }
)

// Initial State
const initialState = fromJS({
  list: [],
  id: '',
  name: ''
})

// Reducer
export default function reducer(state = initialState, action) {
  switch(action.type){
    case CHANGE_MODEL:
      return state.set('id', action.id)
    case MODELS_LOADED:
      return state.set('list', action.list)
    default:
      return state
  }
}

