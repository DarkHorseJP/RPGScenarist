import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import LanguageProvider from 'containers/LanguageProvider'
import configureStore from 'redux/configureStore'
import { renderTranslationMessages } from 'redux/modules/i18n'

import mapSagas from 'redux/modules/map/sagas'
import modelSagas from 'redux/modules/model/sagas'
import githubSagas from 'redux/modules/github/sagas'

import Header from 'components/Header'
import Footer from 'components/Footer'
import Switcher from 'containers/Switcher'

const AppWrapper = styled.div`
  margin: 0;
  display: flex;
  min-height: 100%;
  padding: 0;
  flex-direction: column;
`

function Root() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - RPGScenarist"
        defaultTitle="RPGScenarist"
      />
      <Header />
      <Switcher />
      <Footer />
    </AppWrapper>
  )
}


const initialState = {}
const store = configureStore(initialState)


// FIXME: select sagas to run
store.runSaga(mapSagas[0])
store.runSaga(modelSagas[0])
store.runSaga(githubSagas[0])
store.runSaga(githubSagas[1])
store.runSaga(githubSagas[2])

const render = (messages) => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <Root />
      </LanguageProvider>
    </Provider>,
    document.getElementById('app')
  )
}

renderTranslationMessages(render)

if(process.env.NODE_ENV === 'production'){
  require('offline-plugin/runtime').install()
}

