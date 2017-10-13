import {
  ROUTE_IMAGE_EDIT
} from 'redux/routes/name'
import {
  uploadAsset,
  deleteAsset,
  setAssetTags,
  makeSelectors,
  makeReducer
} from 'redux/modules/asset'

const moduleName = 'image'
const categoryName = 'images'
const locationName = 'imageid'

// Actions
export function changeImage(orgname, reponame, imageid) {
  return {
    type: ROUTE_IMAGE_EDIT,
    payload: { orgname, reponame, imageid }
  }
}

export function uploadImage(id, file, meta) {
  return uploadAsset(categoryName, id, file, meta)
}

export function deleteImage(id) {
  return deleteAsset(categoryName, id)
}

export function setImageTags(id, tags) {
  return setAssetTags(categoryName, id, tags)
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
const selectors = makeSelectors(moduleName)
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

export default makeReducer(categoryName, locationName)

