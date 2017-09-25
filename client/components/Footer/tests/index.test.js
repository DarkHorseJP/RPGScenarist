import React from 'react'
import { shallow } from 'enzyme'

import Footer from '../index'

describe('<Footer />', () => {
  it('should render', () => {
    const renderedComponent = shallow(<Footer />)
    expect(renderedComponent.find('span').length).toBe(1)
  })
})
