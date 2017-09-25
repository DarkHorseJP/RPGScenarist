import React from 'react'
import { shallow, mount } from 'enzyme'
import { FormattedMessage, defineMessages } from 'react-intl'
import { Provider } from 'react-redux'

import { translationMessages } from 'redux/modules/i18n'
import configureStore from 'redux/configureStore'

import ConnectedLanguageProvider, { LanguageProvider } from '../index'

const messages = defineMessages({
  someMessage: {
    id: 'some.id',
    defaultMessage: 'This is some default message',
    en: 'This is some en message'
  }
})

describe('<LanguageProvider />', () => {
  it('should render its children', () => {
    const children = (<h1>Test</h1>)
    const component = shallow(
      <LanguageProvider messages={messages} locale="en">
        {children}
      </LanguageProvider>
    )
    expect(component.contains(children)).toBe(true)
  })
})

describe('<ConnectedLanguageProvider />', () => {
  let store

  beforeAll(() => {
    store = configureStore({})
  })

  it('should render the default language message', () => {
    const component = mount(
      <Provider store={store}>
        <ConnectedLanguageProvider messages={translationMessages}>
          <FormattedMessage {...messages.someMessage} />
        </ConnectedLanguageProvider>
      </Provider>
    )
    expect(component.contains(<FormattedMessage {...messages.someMessage} />)).toBe(true)
  })
})

