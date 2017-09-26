import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { IntlProvider } from 'react-intl'

import { makeSelectLocale } from 'redux/modules/language'

export class LanguageProvider extends React.PureComponent {
  render() {
    return (
      <IntlProvider
        locale={this.props.locale}
        key={this.props.locale}
        messages={this.props.messages[this.props.locale]}
      >
        {React.Children.only(this.props.children)}
      </IntlProvider>
    )
  }
}

const mapStateToProps = createSelector(
  makeSelectLocale(),
  (locale) => ({ locale })
)

LanguageProvider.defaultProps = {
  messages: {}
}

LanguageProvider.propTypes = {
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object,
  children: PropTypes.element.isRequired
}

export default connect(mapStateToProps)(LanguageProvider)

