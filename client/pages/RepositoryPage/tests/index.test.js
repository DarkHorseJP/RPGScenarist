import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'

import configureStore from 'redux/configureStore'

import CommonHeader from 'components/CommonHeader'
import RepositoryPage from '../index'

describe('<RepositoryPage />', () => {
  let store

  beforeAll(() => {
    store = configureStore({})
  })

  it('should render', () => {
    const component = mount(
      <Provider store={store}>
        <RepositoryPage />
      </Provider>
    )
    expect(component.contains(
      <CommonHeader />
    )).toBe(true)
  })
})
