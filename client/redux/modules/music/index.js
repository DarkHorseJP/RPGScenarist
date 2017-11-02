import { createSelector } from 'reselect'
import {
  ROUTE_MUSIC_EDIT
} from 'redux/routes/name'
import {
  uploadAsset,
  deleteAsset,
  setAssetTags,
  makeSelectors,
  makeReducer
} from 'redux/modules/asset'

// Actions
export function changeMusic(orgname, reponame, musicid) {
  return {
    type: ROUTE_MUSIC_EDIT,
    payload: { orgname, reponame, musicid }
  }
}

export function uploadMusic(id, file, meta) {
  return uploadAsset('musics', id, file, meta)
}

export function deleteMusic(id) {
  return deleteAsset('musics', id)
}

export function setMusicTags(id, tags) {
  return setAssetTags('musics', id, tags)
}

// Utility functions
export async function isValidMusicFile(file) {
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
const selectors = makeSelectors('music')
export const selectMusic = selectors.selectAsset
export const selectMusicId = selectors.selectId
export const selectMusicFiles = selectors.selectFiles
export const selectAllMusicIds = selectors.selectAllIds
export const selectAllMusicTags = selectors.selectAllTags
export const selectMusicData = selectors.selectData
export const selectMusicInfo = selectors.selectInfo
export const selectMusicFile = selectors.selectFile
export const selectMusicUrl = selectors.selectUrl
export const makeSelectMusicData = selectors.makeSelectData
export const makeSelectMusicInfo = selectors.makeSelectInfo
export const makeSelectMusicFile = selectors.makeSelectFile
export const makeSelectMusicUrl = selectors.makeSelectUrl

export const selectLoopStart = createSelector(
  selectMusicInfo,
  (info) => (info ? info.get('loopStart') : null)
)
export const selectLoopEnd = createSelector(
  selectMusicInfo,
  (info) => {
    if (!info) {
      return null
    }
    const loopEnd = info.get('loopStart') + info.get('loopEnd')
    if (isNaN(loopEnd)) {
      return 0
    }
    return loopEnd
  }
)
export const selectVolume = createSelector(
  selectMusicInfo,
  (info) => (info ? info.get('volume') : null)
)

export const makeSelectLoopStart = (id) => createSelector(
  makeSelectMusicInfo(id),
  (info) => (info ? info.get('loopStart') : null)
)
export const makeSelectLoopEnd = (id) => createSelector(
  makeSelectMusicInfo(id),
  (info) => {
    if (!info) {
      return null
    }
    const loopEnd = info.get('loopStart') + info.get('loopEnd')
    if (isNaN(loopEnd)) {
      return 0
    }
    return loopEnd
  }
)
export const makeSelectVolume = (id) => createSelector(
  makeSelectMusicInfo(id),
  (info) => (info ? info.get('volume') : null)
)

export default makeReducer('musics', 'musicid')

