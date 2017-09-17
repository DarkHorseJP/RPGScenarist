import { take, call, put, cancel, takeLatest } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import { fromJS } from 'immutable'

import request from 'utils/request'
import { modelsLoaded, LOAD_MODELS } from './index'

export function* getModels() {
  const url = 'https://cdn.rawgit.com/magicien/ReactTest2/master/data/models.json'

  try{
    const modelJson = yield call(request, url)
    const modelIds = Object.keys(modelJson)
    const models = []
    for(const id of modelIds){
      const model = Object.assign({id: id}, modelJson[id])
      models.push(model)
    }
    const immutableModels = fromJS(models)
    
    yield put(modelsLoaded(immutableModels))
  }catch(err){
    console.error(err)
    //yield put(mapsLoadingError(err))
  }
}

export function* modelListData() {
  const watcher = yield takeLatest(LOAD_MODELS, getModels)

  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export default [
  modelListData
]
