import React from 'react'
import { Provider } from 'react-redux'
import { createMockStore } from 'redux-test-utils'
import { mount, render } from 'enzyme'
import {
  shallowWithState as _swState,
  shallowWithStore as _swStore
} from 'enzyme-redux'


export const shallowWithState = _swState

export const shallowWithStore = _swStore

export const mountWithStore = (node, store) => (
  mount(<Provider store={store}>{node}</Provider>)
)

export const mountWithState = (node, state) => {
  const store = createMockStore(state)
  return mountWithStore(node, store)
}

export const renderWithStore = (node, store) => (
  render(<Provider store={store}>{node}</Provider>)
)

export const renderWithState = (node, state) => {
  const store = createMockStore(state)
  return renderWithStore(node, store)
}

