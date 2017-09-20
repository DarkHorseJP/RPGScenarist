import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import LanguageProvider from 'containers/LanguageProvider'
import configureStore from 'redux/configureStore'
import { renderTranslationMessages } from 'redux/modules/i18n'

import mapSagas from 'redux/modules/map/sagas'
import modelSagas from 'redux/modules/model/sagas'
import githubSagas from 'redux/modules/github/sagas'

import Bundle from 'components/Bundle'
import Header from 'components/Header'
import Footer from 'components/Footer'

import loadHomePage from 'bundle-loader?lazy!./pages/HomePage'
import loadRepositoryPage from 'bundle-loader?lazy!./pages/RepositoryPage'
import loadEditorPage from 'bundle-loader?lazy!./pages/EditorPage'
import loadMapPage from 'bundle-loader?lazy!./pages/MapPage'
import loadModelPage from 'bundle-loader?lazy!./pages/ModelPage'
import loadNotFoundPage from 'bundle-loader?lazy!./pages/NotFoundPage'


const pageLoader = (loader) => (props) => (
  <Bundle load={loader}>
    {(Page) => <Page {...props}/>}
  </Bundle>
)

const HomePage = pageLoader(loadHomePage)
const RepositoryPage = pageLoader(loadRepositoryPage)
const EditorPage = pageLoader(loadEditorPage)
const MapPage = pageLoader(loadMapPage)
const ModelPage = pageLoader(loadModelPage)
const NotFoundPage = pageLoader(loadNotFoundPage)

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
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/maps' component={MapPage} />
          <Route path='/orgs' component={RepositoryPage} />
          <Route path='/models' component={ModelPage} />
          <Route path='/edit/:repoid' component={EditorPage} />
          <Route component={NotFoundPage} />
        </Switch>
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
        <BrowserRouter>
          <Root />
        </BrowserRouter>
      </LanguageProvider>
    </Provider>,
    document.getElementById('app')
  )
}

renderTranslationMessages(render)

if(process.env.NODE_ENV === 'production'){
  require('offline-plugin/runtime').install()
}

