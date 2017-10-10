import React from 'react'
import PropTypes from 'prop-types'
import { FormControl } from 'react-bootstrap'

import FileForm from './FileForm'

export const ReduxFileFormControl = FileForm

const ReduxFormControl = ({ input, meta, ...props }) => (
  <FormControl {...props} {...input} />
)

ReduxFormControl.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired
}

export default ReduxFormControl

