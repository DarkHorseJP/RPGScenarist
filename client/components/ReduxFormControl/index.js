import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, ControlLabel } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import FileForm from './FileForm'

export const ReduxFileFormControl = FileForm

const ReduxFormControl = ({ input, meta, ...props }) => {
  let WarnTag = () => null
  let ErrorTag = () => null
  let className = ''
  if (meta.touched) {
    if (meta.warning) {
      className = 'has-warning'
      WarnTag = () => (
        <ControlLabel>
          <FormattedMessage {...meta.warning} />
        </ControlLabel>
      )
    }
    if (meta.error) {
      className = 'has-error'
      ErrorTag = () => (
        <ControlLabel>
          <FormattedMessage {...meta.error} />
        </ControlLabel>
      )
    }
  }

  return (
    <div className={className}>
      <FormControl {...props} {...input} />
      <ErrorTag />
      <WarnTag />
    </div>
  )
}

ReduxFormControl.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired
}

export default ReduxFormControl

