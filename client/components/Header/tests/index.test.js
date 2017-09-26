import React from 'react'
import { shallow } from 'enzyme'

import Header from '../index'

describe('<Header />', () => {
  it('should render', () => {
    const renderedComponent = shallow(<Header />)
    expect(renderedComponent.find('span').length).toBe(1)
  })
})
