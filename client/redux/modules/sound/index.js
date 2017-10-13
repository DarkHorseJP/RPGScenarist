import {
  uploadAsset,
  deleteAsset,
  setAssetTags,
  makeSelectors,
  makeReducer
} from 'redux/modules/asset'

// Actions
export function uploadSound(id, file, meta) {
  return uploadAsset('sounds', id, file, meta)
}

export function deleteSound(id) {
  return deleteAsset('sounds', id)
}

export function setSoundTags(id, tags) {
  return setAssetTags('sounds', id, tags)
}

// Utility functions
export async function isValidSoundFile(file) {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file)
      const audio = document.createElement('audio')
      audio.addEventListener('canplay', () => {
        resolve(true)
      })
      audio.addEventListener('error', () => {
        resolve(false)
      })
      audio.src = url
      audio.load()
    } catch (err) {
      console.error(err)
      resolve(false)
    }
  })
}

// Selector
const selectors = makeSelectors('sound')
export const selectSound = selectors.selectAsset
export const selectSoundId = selectors.selectId
export const selectSoundFiles = selectors.selectFiles
export const selectAllSoundIds = selectors.selectAllIds
export const selectAllSoundTags = selectors.selectAllTags
export const selectSoundData = selectors.selectData
export const selectSoundInfo = selectors.selectInfo
export const selectSoundFile = selectors.selectFile
export const selectSoundUrl = selectors.selectUrl
export const makeSelectSoundData = selectors.makeSelectData
export const makeSelectSoundInfo = selectors.makeSelectInfo
export const makeSelectSoundFile = selectors.makeSelectFile
export const makeSelectSoundUrl = selectors.makeSelectUrl

export default makeReducer('sounds', 'soundid')

