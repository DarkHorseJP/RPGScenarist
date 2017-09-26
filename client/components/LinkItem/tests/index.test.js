import React from 'react'
import { createMockStore } from 'redux-test-utils'

import {
  mountWithStore
} from 'utils/redux.test'
import LinkItem from '../index'

jest.mock('redux-first-router', () => {
  const routerMock = require('utils/mock.test').createRouterMock({ // eslint-disable-line global-require
    '/test': { action: 'ROUTE_TEST' }
  })
  return routerMock
})

describe('<LinkItem />', () => {
  let store

  beforeAll(() => {
    const state = {}
    store = createMockStore(state)
  })

  it('should render an "a" tag', () => {
    const component = mountWithStore(
      (<LinkItem />),
      store
    )
    expect(component.find('a').length).toBe(1)
  })

  it('should render a div tag', () => {
    const component = mountWithStore(
      <LinkItem tag="div" />,
      store
    )
    expect(component.find('div').length).toBe(1)
  })

  it('should render a node', () => {
    const SpanTag = () => (<span>SpanTag</span>)
    const component = mountWithStore(
      <LinkItem tag={SpanTag} />,
      store
    )
    expect(component.find('span').length).toBe(1)
  })

  it('should have a href', () => {
    const component = mountWithStore(
      (<LinkItem href="/test" />),
      store
    )
    expect(component.find('LinkItem').prop('href')).toBe('/test')
  })

  it('should have a to', () => {
    const component = mountWithStore(
      (<LinkItem to="/test" />),
      store
    )
    expect(component.find('LinkItem').prop('to')).toBe('/test')
  })

  it('should handle click events', () => {
    const component = mountWithStore(
      (<LinkItem href="/test" />),
      store
    )
    component
      .find('a')
      .simulate('click')
    const actions = store.getActions()
    expect(actions).toEqual([{ action: 'ROUTE_TEST' }])
  })
})

