import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Row, Col, ControlLabel } from 'react-bootstrap'

const FormGroupRow = ({ label, children }) => (
  <FormGroup>
    <Row>
      <Col componentClass={ControlLabel} sm={3}>
        {label}
      </Col>
      <Col sm={9}>
        {children}
      </Col>
    </Row>
  </FormGroup>
)

FormGroupRow.defaultProps = {
  label: ''
}

FormGroupRow.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  children: PropTypes.node.isRequired
}

export default FormGroupRow

