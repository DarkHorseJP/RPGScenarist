import {
  ROUTE_MOTION_EDIT
} from 'redux/routes/name'
import {
  uploadAsset,
  deleteAsset,
  setAssetTags,
  makeSelectors,
  makeReducer
} from 'redux/modules/asset'

// Actions
export function changeMotion(orgname, reponame, motionid) {
  return {
    type: ROUTE_MOTION_EDIT,
    payload: { orgname, reponame, motionid }
  }
}

export function uploadMotion(id, file, meta) {
  return uploadAsset('motions', id, file, meta)
}

export function deleteMotion(id) {
  return deleteAsset('motions', id)
}

export function setMotionTags(id, tags) {
  return setAssetTags('motions', id, tags)
}

// Utility functions
export async function isValidMotionFile(file) {
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
const selectors = makeSelectors('motion')
export const selectMotion = selectors.selectAsset
export const selectMotionId = selectors.selectId
export const selectMotionFiles = selectors.selectFiles
export const selectAllMotionIds = selectors.selectAllIds
export const selectAllMotionTags = selectors.selectAllTags
export const selectMotionData = selectors.selectData
export const selectMotionInfo = selectors.selectInfo
export const selectMotionFile = selectors.selectFile
// export const selectMotionUrl = selectors.selectUrl
export const makeSelectMotionData = selectors.makeSelectData
export const makeSelectMotionInfo = selectors.makeSelectInfo
export const makeSelectMotionFile = selectors.makeSelectFile
export const makeSelectMotionUrl = selectors.makeSelectUrl

export default makeReducer('motions', 'motionid')

