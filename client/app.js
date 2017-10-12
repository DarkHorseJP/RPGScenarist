import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import LanguageProvider from 'containers/LanguageProvider'
import configureStore from 'redux/configureStore'
import { renderTranslationMessages } from 'redux/modules/i18n'

import Header from 'components/Header'
import Footer from 'components/Footer'
import Switcher from 'containers/Switcher'

import './global-styles'

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

/* eslint global-require: 0 */
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install()
}

