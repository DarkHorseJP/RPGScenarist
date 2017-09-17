import { take, call, put, cancel, takeLatest } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import { fromJS } from 'immutable'

import request from 'utils/request'
import { mapsLoaded, LOAD_MAPS } from './index'

export function* getMaps() {
  const url = 'https://cdn.rawgit.com/magicien/ReactTest2/master/data/maps.json'

  try{
    const mapJson = yield call(request, url)
    const mapIds = Object.keys(mapJson)
    const maps = []
    for(const id of mapIds){
      const map = Object.assign({id: id}, mapJson[id])
      maps.push(map)
    }
    const immutableMaps = fromJS(maps)
    
    yield put(mapsLoaded(immutableMaps))
  }catch(err){
    console.error(err)
    //yield put(mapsLoadingError(err))
  }
}

export function* mapListData() {
  const watcher = yield takeLatest(LOAD_MAPS, getMaps)

  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export default [
  mapListData
]
