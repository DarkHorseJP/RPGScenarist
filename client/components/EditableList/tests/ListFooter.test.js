import React from 'react'
import { mount } from 'enzyme'

import ListFooter from '../ListFooter'

describe('<ListFooter />', () => {
  it('should render without event functions', () => {
    const renderedComponent = mount(<ListFooter />)
    expect(() => {
      renderedComponent
        .findWhere((item) => item.name() === 'button' && item.text() === '+')
        .simulate('click')
      renderedComponent
        .findWhere((item) => item.name() === 'button' && item.text() === '-')
        .simulate('click')
    }).not.toThrow()
  })

  it('should handle + button click events', () => {
    const onCreateSpy = jest.fn()
    const renderedComponent = mount(<ListFooter onCreate={onCreateSpy} />)
    renderedComponent
      .findWhere((item) => item.name() === 'button' && item.text() === '+')
      .simulate('click')
    expect(onCreateSpy).toHaveBeenCalled()
  })

  it('should handle - button click events', () => {
    const onDeleteSpy = jest.fn()
    const renderedComponent = mount(<ListFooter onDelete={onDeleteSpy} />)
    renderedComponent
      .findWhere((item) => item.name() === 'button' && item.text() === '-')
      .simulate('click')
    expect(onDeleteSpy).toHaveBeenCalled()
  })
})

