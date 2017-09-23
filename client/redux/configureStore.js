import { createStore, applyMiddleware, compose } from 'redux'
import { fromJS } from 'immutable'
// import createSagaMiddleware from 'redux-saga'

import createReducer from './reducers'
import {
  middleware as locationMiddleware,
  enhancer as locationEnhancer
} from './modules/location'

// const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState = {}) {
  const middlewares = [
    // sagaMiddleware,
    locationMiddleware
  ]
  const enhancers = [
    locationEnhancer,
    applyMiddleware(...middlewares)
  ]

  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
  /* eslint-enable no-underscore-dangle */

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  )
  // store.runSaga = sagaMiddleware.run
  store.asyncReducers = {}

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      import('./reducers').then((reducerModule) => {
        const createReducers = reducerModule.default
        const nextReducers = createReducers(store.asyncReducers)

        store.replaceReducer(nextReducers)
      })
    })
  }

  return store
}

