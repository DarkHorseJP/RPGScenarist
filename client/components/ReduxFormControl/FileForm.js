import React from 'react'
import PropTypes from 'prop-types'

const passFiles = (handler) => (e) => handler([...e.target.files])
export const ReduxFileFormControl = ({
  input: {
    value,
    onChange,
    onBlur,
    ...inputProps
  },
  meta,
  ...props
}) => (
  <input
    type="file"
    onChange={passFiles(onChange)}
    onBlur={passFiles(onBlur)}
    {...inputProps}
    {...props}
  />
)

ReduxFileFormControl.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired
}

export default ReduxFileFormControl

