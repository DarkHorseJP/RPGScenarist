import {
  ROUTE_MODEL_EDIT
} from 'redux/routes/name'
import {
  uploadAsset,
  deleteAsset,
  setAssetTags,
  makeSelectors,
  makeReducer
} from 'redux/modules/asset'

// Actions
export function changeModel(orgname, reponame, modelid) {
  return {
    type: ROUTE_MODEL_EDIT,
    payload: { orgname, reponame, modelid }
  }
}

export function uploadModel(id, file, meta) {
  return uploadAsset('models', id, file, meta)
}

export function deleteModel(id) {
  return deleteAsset('models', id)
}

export function setModelTags(id, tags) {
  return setAssetTags('models', id, tags)
}

// Utility functions
export async function isValidModelFile(file) {
  // return new Promise((resolve) => {
  //  try {
  //    const url = URL.createObjectURL(file)
  //    const audio = document.createElement('audio')
  //    audio.addEventListener('canplay', () => {
  //      resolve(true)
  //    })
  //    audio.addEventListener('error', () => {
  //      resolve(false)
  //    })
  //    audio.src = url
  //    audio.load()
  //  } catch (err) {
  //    console.error(err)
  //    resolve(false)
  //  }
  // })
  // TODO: implement
  return Promise.resolve(file)
}

// Selector
const selectors = makeSelectors('model')
export const selectModel = selectors.selectAsset
export const selectModelId = selectors.selectId
export const selectModelFiles = selectors.selectFiles
export const selectAllModelIds = selectors.selectAllIds
export const selectAllModelTags = selectors.selectAllTags
export const selectModelData = selectors.selectData
export const selectModelInfo = selectors.selectInfo
export const selectModelFile = selectors.selectFile
// export const selectModelUrl = selectors.selectUrl
export const makeSelectModelData = selectors.makeSelectData
export const makeSelectModelInfo = selectors.makeSelectInfo
export const makeSelectModelFile = selectors.makeSelectFile
export const makeSelectModelUrl = selectors.makeSelectUrl

export default makeReducer('models', 'modelid')

