import {
  redirect,
  pathToAction as origPathToAction,
  actionToPath as origActionToPath,
  NOT_FOUND
} from 'redux-first-router'

import {
  userLoaded,
  organizationsLoaded,
  repositoriesLoaded,
  getUser,
  getOrganizations,
  getRepositories,
  getArchive,
  getHeadSha,
  getAllSha,
  createBranch,
  selectInstallationId
} from 'redux/modules/github'
import {
  // deleteDB,
  restoreData,
  parseZipData,
  setShaData,
  dbLoaded
} from 'redux/modules/db'
import * as Route from './name'

const isAllowed = (type, user, routesMap) => {
  const role = routesMap[type] && routesMap[type].role

  if (!role) return true
  if (!user || !user.roles) return false

  return user.roles.includes(role)
}

const getRepositoryData = (dispatch, orgname) => {
  getOrganizations().then((orgData) => {
    const org = orgData.find((data) => data.getIn(['account', 'login']) == orgname) // eslint-disable-line eqeqeq
    if (org) {
      getRepositories(org.get('id')).then((data) => {
        dispatch(repositoriesLoaded(data))
      })
    }
    dispatch(organizationsLoaded(orgData))
  })
}

const getMetaData = (data, key) => {
  const metaData = data.meta[key]
  return metaData ? metaData.value : null
}

async function loadData(dispatch, state) {
  const loc = state.get('location')
  const payload = loc.payload
  const userName = state.getIn(['github', 'user', 'name'])
  const instid = selectInstallationId(state)

  const { orgname, reponame } = payload

  let goBackAction = loc.prev
  if (!goBackAction
    || !goBackAction.payload
    || !goBackAction.payload.orgname
    || !goBackAction.payload.reponame) {
    goBackAction = {
      type: Route.ROUTE_EDIT,
      payload: { orgname, reponame }
    }
  }

  // DEBUG
  // await deleteDB(orgname, reponame, userName, 'orig')
  // await deleteDB(orgname, reponame, userName, 'edit')

  const dbData = await restoreData(orgname, reponame, userName)
  let headSha = await getHeadSha(instid, orgname, reponame, `user/${userName}`)
  if (dbData) {
    if (headSha === null) {
      // create branch
      const devSha = await getHeadSha(instid, orgname, reponame, 'develop')
      if (devSha === null) {
        throw new Error('develop branch is not found')
      }

      const result = await createBranch(instid, orgname, reponame, `user/${userName}`, devSha)
      if (typeof result.object === 'undefined' || typeof result.object.sha === 'undefined') {
        throw new Error(`createBranch error: ${JSON.stringify(result)}`)
      }
      headSha = result.object.sha
    }

    // const shortSha = headSha.substring(0, 7)
    const dbSha = getMetaData(dbData, 'sha')

    if (headSha === dbSha) {
      // up to date
      console.log(`UpToDate headSha: ${headSha}`)
      dispatch(dbLoaded(instid, dbData))
      console.log('goback')
      dispatch(goBackAction)
      return
    }
  }

  const branch = encodeURIComponent(`user/${userName}`)
  const zip = await getArchive(instid, orgname, reponame, branch)
  if (!zip) {
    throw new Error('archive load error')
  }
  await parseZipData(zip, orgname, reponame, userName)

  const shaData = await getAllSha(instid, orgname, reponame, headSha)
  await setShaData(orgname, reponame, userName, shaData)

  const data = await restoreData(orgname, reponame, userName)
  dispatch(dbLoaded(instid, data))
  console.log('goback')
  dispatch(goBackAction)
}

export const routeOptions = {
  location: (state) => {
    const loc = state.get('location')
    return (loc && loc.toJS) ? loc.toJS() : loc
  },
  onBeforeChange: (dispatch, getState, action) => {
    const state = getState()
    const user = state.getIn(['github', 'user'])
    if (typeof user.get('name') === 'undefined'
      && window
      && window.localStorage
      && window.localStorage.token) {
      console.log('INITIALIZE')
      const redirectAction = redirect({ type: 'INITIALIZE' })
      dispatch(redirectAction)
      getUser()
        .then((userData) => {
          dispatch(userLoaded(userData))
          getOrganizations().then((data) => {
            dispatch(organizationsLoaded(data))
            // redispatch action
            dispatch(action.action)
          })
        })
        .catch(() => {
          // seems token is invalid. nothing to do.
        })
      return
    }
    const loc = state.get('location')
    const routesMap = loc.routesMap
    const allowed = isAllowed(action.type, user, routesMap)

    if (!allowed) {
      const redirectAction = redirect({ type: 'LOGIN' })
      dispatch(redirectAction)
      return
    }

    const userName = user.get('name')
    if (typeof userName === 'undefined') {
      return
    }

    if (action && action.action && action.action.payload) {
      const payload = action.action.payload
      const type = action.action.type
      if (payload.orgname) {
        getRepositoryData(dispatch, payload.orgname)

        if (payload.reponame && type !== Route.ROUTE_LOAD) {
          // check if DB is loaded
          const dbInfo = state.get('db')
          if (dbInfo.get('owner') !== payload.orgname
            || dbInfo.get('repo') !== payload.reponame
            || dbInfo.get('user') !== userName) {
            console.log('go to load')
            // go to load data
            dispatch({ type: Route.ROUTE_LOAD, payload })
          }
        }
      }
    }
  },

  onAfterChange: () => {
  }
}

const routesMap = {
  [Route.ROUTE_HOME]: {
    path: '/',
    page: 'HomePage'
  },
  [Route.ROUTE_ORGS]: {
    path: '/edit',
    page: 'RepositoryPage',
    thunk: async (dispatch) => {
      dispatch(repositoriesLoaded(null))
    }
  },
  [Route.ROUTE_ORG_REPOS]: {
    path: '/edit/:orgname',
    page: 'RepositoryPage'
  },
  [Route.ROUTE_LOAD]: {
    path: '/load/:orgname/:reponame',
    page: 'LoadPage',
    thunk: async (dispatch, getState) => {
      const state = getState()
      loadData(dispatch, state)
    }
  },
  [Route.ROUTE_EDIT]: {
    path: '/edit/:orgname/:reponame',
    page: 'EditorPage'
  },
  [Route.ROUTE_GENERAL]: {
    path: '/edit/:orgname/:reponame/general',
    page: 'GeneralPage'
  },
  [Route.ROUTE_RELEASES]: {
    path: '/edit/:orgname/:reponame/releases',
    page: 'GeneralPage'
  },
  [Route.ROUTE_DB]: {
    path: '/edit/:orgname/:reponame/db',
    page: 'GeneralPage'
  },
  [Route.ROUTE_BATTLE]: {
    path: '/edit/:orgname/:reponame/battle',
    page: 'GeneralPage'
  },
  [Route.ROUTE_MODELS]: {
    path: '/edit/:orgname/:reponame/models',
    page: 'ModelPage'
  },
  [Route.ROUTE_MODEL_EDIT]: {
    path: '/edit/:orgname/:reponame/models/:modelid',
    page: 'ModelPage'
  },
  [Route.ROUTE_MOTIONS]: {
    path: '/edit/:orgname/:reponame/motions',
    page: 'MotionPage'
  },
  [Route.ROUTE_MOTION_EDIT]: {
    path: '/edit/:orgname/:reponame/motions/:motionid',
    page: 'MotionPage'
  },
  [Route.ROUTE_IMAGES]: {
    path: '/edit/:orgname/:reponame/images',
    page: 'ImagePage'
  },
  [Route.ROUTE_IMAGE_EDIT]: {
    path: '/edit/:orgname/:reponame/images/:imageid',
    page: 'ImagePage'
  },
  [Route.ROUTE_MUSICS]: {
    path: '/edit/:orgname/:reponame/musics',
    page: 'MusicPage'
  },
  [Route.ROUTE_MUSIC_EDIT]: {
    path: '/edit/:orgname/:reponame/musics/:musicid',
    page: 'MusicPage'
  },
  [Route.ROUTE_SOUNDS]: {
    path: '/edit/:orgname/:reponame/sounds',
    page: 'SoundPage'
  },
  [Route.ROUTE_SOUND_EDIT]: {
    path: '/edit/:orgname/:reponame/sounds/:soundid',
    page: 'SoundPage'
  },

  [NOT_FOUND]: {
    path: '/not-found',
    page: 'NotFoundPage'
  }
}

export const pathToAction = (path) => origPathToAction(path, routesMap)
export const actionToPath = (action) => origActionToPath(action, routesMap)

export default routesMap

