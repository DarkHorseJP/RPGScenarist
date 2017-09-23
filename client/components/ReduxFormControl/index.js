import React from 'react'
import PropTypes from 'prop-types'
import { FormControl } from 'react-bootstrap'

const ReduxFormControl = ({ input, meta, ...props }) => (
  <FormControl {...props} {...input} />
)

ReduxFormControl.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired
}

export default ReduxFormControl

