import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form/immutable'

import ReduxFormControl from 'components/ReduxFormControl'
import FormGroupRow from './FormGroupRow'

const LabeledControl = ({ name, label, type }) => (
  <FormGroupRow label={label}>
    <Field
      name={name}
      component={ReduxFormControl}
      type={type}
    />
  </FormGroupRow>
)

LabeledControl.defaultProps = {
  label: '',
  type: 'text'
}

LabeledControl.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  type: PropTypes.string
}

export default LabeledControl

