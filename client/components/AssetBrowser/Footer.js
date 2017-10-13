import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import messages from './messages'

const Footer = ({ onClick, assetName, filesName }) => (
  <div>
    <Button bsStyle="primary" onClick={onClick}>
      <FormattedMessage {...messages.add} values={{ assetName }} />
    </Button>
    {' '}<FormattedMessage {...messages.dropFile} values={{ filesName }} />
  </div>
)

Footer.defaultProps = {
  onClick: () => {}
}

Footer.propTypes = {
  onClick: PropTypes.func,
  assetName: PropTypes.string.isRequired,
  filesName: PropTypes.string.isRequired
}

export default Footer

