import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import messages from './messages'

const Footer = ({ onClick }) => (
  <div>
    <Button bsStyle="primary" onClick={onClick}>
      <FormattedMessage {...messages.addSound} />
    </Button>
    <FormattedMessage {...messages.dragSoundFile} />
  </div>
)

Footer.defaultProps = {
  onClick: () => {}
}

Footer.propTypes = {
  onClick: PropTypes.func
}

export default Footer

