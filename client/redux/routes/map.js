import { redirect } from 'redux-first-router'
import { fromJS } from 'immutable'

import {
  userLoaded,
  organizationsLoaded,
  repositoriesLoaded,
  gameDataLoaded,
  getUser,
  getOrganizations,
  getRepositories,
  getGameData
} from 'redux/modules/github'
import {
  getImageData,
  imagesLoaded
} from 'redux/modules/image'
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

const getGameDataJSON = (dispatch, orgname, reponame) => {
  getGameData(orgname, reponame).then((gameData) => {
    dispatch(gameDataLoaded(gameData))
  })
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
      getUser().then((userData) => {
        dispatch(userLoaded(userData))
        getOrganizations().then((data) => {
          dispatch(organizationsLoaded(data))
          // redispatch action
          dispatch(action.action)
        })
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

    if (typeof user.get('name') === 'undefined') {
      return
    }

    if (action && action.action && action.action.payload) {
      const payload = action.action.payload
      if (payload.orgname) {
        getRepositoryData(dispatch, payload.orgname)

        if (payload.reponame) {
          getGameDataJSON(dispatch, payload.orgname, payload.reponame)
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
      dispatch(repositoriesLoaded(fromJS([])))
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
  [Route.ROUTE_IMAGES]: {
    path: '/edit/:orgname/:reponame/images',
    page: 'ImagePage',
    thunk: async (dispatch, getState) => {
      const branch = 'master'
      const payload = getState().get('location').payload
      const gameData = await getGameData(payload.orgname, payload.reponame, payload.imageid)
      const promises = gameData.get('images').map((imageInfo) => (
        getImageData(payload.orgname, payload.reponame, imageInfo.get('id'))
          .then((json) => {
            const url = `https://rawgit.com/${payload.orgname}/${payload.reponame}/${branch}/images/${imageInfo.get('id')}/${json.path}`
            const param = { ...json, url }
            return { [imageInfo.get('id')]: param }
          })
      ))
      Promise.all(promises).then((data) => {
        const images = Object.assign({}, ...data)
        dispatch(imagesLoaded(images))
      }).catch((err) => {
        console.error(`image load error: ${err}`)
      })
    }

  },
  [Route.ROUTE_IMAGE_EDIT]: {
    path: '/edit/:orgname/:reponame/images/:imageid',
    page: 'ImagePage'
  }
}

export default routesMap

