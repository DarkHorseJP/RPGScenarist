import { take, call, put, cancel, takeLatest } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import { fromJS } from 'immutable'

import request from 'utils/request'
import { 
  userLoaded,
  LOAD_USER,
  organizationsLoaded, 
  LOAD_ORGANIZATIONS,
  repositoriesLoaded,
  LOAD_REPOSITORIES
} from './index'

const getOptions = () => {
  return {
    headers: {
      'X-CSRF-TOKEN': localStorage.getItem('token')
    },
    credentials: 'same-origin'
  }
}

export function* getUser() {
  const url = '/github/user'

  try {
    const userJson = yield call(request, url, getOptions())
    console.log('userJson: ' + JSON.stringify(userJson))
    const immutableUser = fromJS(userJson)

    yield put(userLoaded(immutableUser))
  }catch(err){
    console.error(err)
  }
}

export function* getOrganizations() {
  const url = '/github/organizations'

  try{
    const orgJson = yield call(request, url, getOptions())
    const immutableOrgs = fromJS(orgJson)
    
    yield put(organizationsLoaded(immutableOrgs))
  }catch(err){
    console.error(err)
    //yield put(mapsLoadingError(err))
  }
}

export function* getRepositories(action) {
  const url = `/github/organizations/${action.instid}/repos`
  try{
    const json = yield call(request, url, getOptions())
    const immutableRepos = fromJS(json)
    
    yield put(repositoriesLoaded(immutableRepos))
  }catch(err){
    console.error(err)
    //yield put(mapsLoadingError(err))
  }
}

export function* userData() {
  yield call(getUser)
  //const watcher = yield takeLatest(LOCATION_CHANGE, getUser)
  //yield take(LOCATION_CHANGE)
  //yield cancel(watcher)
}

export function* orgListData() {
  const watcher = yield takeLatest(LOAD_ORGANIZATIONS, getOrganizations)

  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export function* reposListData() {
  const watcher = yield takeLatest(LOAD_REPOSITORIES, getRepositories)

  yield take(LOCATION_CHANGE)
  yield cancel(watcher)
}

export default [
  userData,
  orgListData,
  reposListData
]
