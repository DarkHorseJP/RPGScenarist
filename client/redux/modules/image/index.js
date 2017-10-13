import {
  uploadAsset,
  deleteAsset,
  setAssetTags,
  makeSelectors,
  makeReducer
} from 'redux/modules/asset'

// Actions
export function uploadImage(id, file, meta) {
  return uploadAsset('images', id, file, meta)
}

export function deleteImage(id) {
  return deleteAsset('images', id)
}

export function setImageTags(id, tags) {
  return setAssetTags('images', id, tags)
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
const selectors = makeSelectors('image')
export const selectImage = selectors.selectAsset
export const selectImageId = selectors.selectId
export const selectImageFiles = selectors.selectFiles
export const selectAllImageIds = selectors.selectAllIds
export const selectAllImageTags = selectors.selectAllTags
export const selectImageData = selectors.selectData
export const selectImageInfo = selectors.selectInfo
export const selectImageFile = selectors.selectFile
export const selectImageUrl = selectors.selectUrl
export const makeSelectImageData = selectors.makeSelectData
export const makeSelectImageInfo = selectors.makeSelectInfo
export const makeSelectImageFile = selectors.makeSelectFile
export const makeSelectImageUrl = selectors.makeSelectUrl

export default makeReducer('images', 'imageid')

