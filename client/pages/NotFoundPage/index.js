import React from 'react'
import { FormattedMessage } from 'react-intl'

import messages from './messages'

export default function NotFound() {
  return (
    <article>
      <FormattedMessage {...messages.header} />
    </article>
  )
}
