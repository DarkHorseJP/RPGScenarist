import { addLocaleData } from 'react-intl'
import enLocaleData from 'react-intl/locale-data/en'
import jaLocaleData from 'react-intl/locale-data/ja'

import { DEFAULT_LOCALE } from 'config'
import enTranslationMessages from 'translations/en.json'
import jaTranslationMessages from 'translations/ja.json'

addLocaleData(enLocaleData)
addLocaleData(jaLocaleData)

export const appLocales = [
  'en',
  'ja'
]

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages = locale !== DEFAULT_LOCALE
    ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
    : {}

  return Object.keys(messages).reduce((formattedMessages, key) => {
    const formattedMessage = !messages[key] && locale !== DEFAULT_LOCALE
      ? defaultFormattedMessages[key]
      : messages[key]
    return Object.assign(formattedMessages, { [key]: formattedMessage })
  }, {})
}

export const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
  ja: formatTranslationMessages('ja', jaTranslationMessages)
}

export const renderTranslationMessages = (render) => {
  // if(module.hot){
  //  module.hot.accept('redux/modules/i18n', () => {
  //    render(translationMessages)
  //  })
  // }

  if (!window.Intl) {
    (new Promise((resolve) => {
      resolve(import('intl'))
    }))
      .then(() => Promise.all([
      import('intl/locale-data/jsonp/en.js'),
      import('intl/locale-data/jsonp/ja.js')
      ]))
      .then(() => render(translationMessages))
      .catch((err) => {
        throw err
      })
  } else {
    render(translationMessages)
  }
}

