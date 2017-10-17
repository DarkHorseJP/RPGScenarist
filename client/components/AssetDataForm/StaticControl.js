import React from 'react'
import PropTypes from 'prop-types'
import { FormControl } from 'react-bootstrap'

import FormGroupRow from './FormGroupRow'

const StaticControl = ({ label, value }) => (
  <FormGroupRow label={label}>
    <FormControl.Static>{value}</FormControl.Static>
  </FormGroupRow>
)

StaticControl.defaultProps = {
  label: '',
  value: ''
}

StaticControl.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
}

export default StaticControl

