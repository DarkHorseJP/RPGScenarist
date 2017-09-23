import React from 'react'
import { FormControl } from 'react-bootstrap'

const ReduxFormControl = ({input, meta, ...props}) => (
  <FormControl {...props} {...input} />
)
export default ReduxFormControl
