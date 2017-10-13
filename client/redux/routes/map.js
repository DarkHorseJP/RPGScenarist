import {
  redirect,
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
  selectInstallationId
} from 'redux/modules/github'
import {
//  deleteDB,
  restoreData,
  parseZipData,
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
  [Route.ROUTE_EDIT]: {
    path: '/edit/:orgname/:reponame',
    page: 'EditorPage'
  },
  [Route.ROUTE_LOAD]: {
    path: '/load/:orgname/:reponame',
    page: 'LoadPage',
    thunk: async (dispatch, getState) => {
      const state = getState()
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
      if (dbData) {
        const headSha = await getHeadSha(instid, orgname, reponame, `user/${userName}`)
        if (headSha === null) {
          // could not get a branch sha
          // TODO: create branch
          return
        }

        const shortSha = headSha.substring(0, 7)
        const dbSha = getMetaData(dbData, 'sha')
        // const dbOwner = getMetaData(dbData, 'owner')
        // const dbRepo = getMetaData(dbData, 'repo')
        // const dbUser = getMetaData(dbData, 'user')

        if (shortSha === dbSha) {
          // up to date
          dispatch(dbLoaded(dbData))
          dispatch(goBackAction)
          return
        }
      }

      const branch = encodeURIComponent(`user/${userName}`)
      const zip = await getArchive(orgname, reponame, branch)
      if (!zip) {
        // TODO: create a branch
        console.error('archive load error')
        return
      }
      await parseZipData(zip, orgname, reponame, userName)
      const data = await restoreData(orgname, reponame, userName)
      dispatch(dbLoaded(data))
      dispatch(goBackAction)
    }
  },
  [Route.ROUTE_IMAGES]: {
    path: '/edit/:orgname/:reponame/images',
    page: 'ImagePage'
  },
  [Route.ROUTE_IMAGE_EDIT]: {
    path: '/edit/:orgname/:reponame/images/:imageid',
    page: 'ImagePage'
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

export default routesMap

