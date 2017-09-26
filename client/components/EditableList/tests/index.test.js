import React from 'react'
import { mount } from 'enzyme'
import { fromJS } from 'immutable'

import EditableList from '../index'

describe('<EditableList />', () => {
  it('should have a className', () => {
    const renderedComponent = mount(<EditableList className="test" />)
    expect(renderedComponent.find('div.test').length).toBe(1)
  })

  it('should have a style', () => {
    const renderedComponent = mount(<EditableList className="test" style={{ color: 'red' }} />)
    expect(renderedComponent.find('div.test').prop('style')).toEqual({ color: 'red' })
  })

  it('should have a height', () => {
    const renderedComponent = mount(<EditableList className="test" height="300px" />)
    expect(renderedComponent.find('div[height="300px"]').length).toBe(1)
  })

  const items = fromJS([
    { id: 'id1', value: 'value1' },
    { id: 'id2', value: 'value2' },
    { id: 'id3', value: 'value3' }
  ])

  it('should have items as ListGroupItems', () => {
    const renderedComponent = mount(<EditableList items={items} />)
    expect(renderedComponent.find('ListGroupItem').length).toBe(3)
  })

  it('should use item.id for text by default', () => {
    const renderedComponent = mount(<EditableList items={items} />)
    const texts = renderedComponent.find('ListGroupItem').map((item) => item.text())
    expect(texts).toEqual(['id1', 'id2', 'id3'])
  })

  it('should use item.[valueName] for text', () => {
    const renderedComponent = mount(<EditableList items={items} valueName="value" />)
    const texts = renderedComponent.find('ListGroupItem').map((item) => item.text())
    expect(texts).toEqual(['value1', 'value2', 'value3'])
  })

  it('should have an active item', () => {
    const renderedComponent = mount(<EditableList items={items} selectedKey="id2" />)
    const actives = renderedComponent.find('ListGroupItem').map((item) => item.prop('active'))
    expect(actives).toEqual([false, true, false])
  })

  it('should use keyName for selectedKey', () => {
    const renderedComponent = mount(
      <EditableList items={items} keyName="value" selectedKey="value3" />
    )
    const actives = renderedComponent.find('ListGroupItem').map((item) => item.prop('active'))
    expect(actives).toEqual([false, false, true])
  })

  it('should handle ListGroupItem click events', () => {
    const onClickSpy = jest.fn()
    const renderedComponent = mount(<EditableList items={items} onClick={onClickSpy} />)
    renderedComponent.find('ListGroupItem').first().simulate('click')
    expect(onClickSpy).toHaveBeenCalled()
  })

  it('should handle + button click events', () => {
    const onCreateSpy = jest.fn()
    const renderedComponent = mount(<EditableList items={items} onCreate={onCreateSpy} />)
    renderedComponent
      .findWhere((item) => item.name() === 'button' && item.text() === '+')
      .simulate('click')
    expect(onCreateSpy).toHaveBeenCalled()
  })

  it('should handle - button click events', () => {
    const onDeleteSpy = jest.fn()
    const renderedComponent = mount(<EditableList items={items} onDelete={onDeleteSpy} />)
    renderedComponent
      .findWhere((item) => item.name() === 'button' && item.text() === '-')
      .simulate('click')
    expect(onDeleteSpy).toHaveBeenCalled()
  })

  it('should get an item of keyPath', () => {
    const nestedItem = fromJS([
      {
        parent: {
          childName: 'name1',
          childValue: 'value1'
        }
      }
    ])
    const renderedComponent = mount(
      <EditableList
        items={nestedItem}
        keyName="parent.childName"
        valueName="parent.childValue"
        selectedKey="name1"
      />
    )
    const item = renderedComponent.find('ListGroupItem')
    expect(item.prop('active')).toBe(true)
    expect(item.text()).toBe('value1')
  })

  it('should render without event functions', () => {
    const renderedComponent = mount(<EditableList items={items} />)
    expect(() => {
      renderedComponent
        .find('ListGroupItem')
        .first()
        .simulate('click')
      renderedComponent
        .findWhere((item) => item.name() === 'button' && item.text() === '+')
        .simulate('click')
      renderedComponent
        .findWhere((item) => item.name() === 'button' && item.text() === '-')
        .simulate('click')
    }).not.toThrow()
  })
})
