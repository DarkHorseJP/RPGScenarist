import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap'

import ReduxFormControl from 'components/ReduxFormControl'
import { selectImageId } from 'redux/modules/image'

let ImageDataForm = ({ handleSubmit }) => (
  <Form horizontal onSubmit={handleSubmit}>
    <FormGroup>
      <Col componentClass={ControlLabel} sm={2}>
        ID
      </Col>
      <Col sm={10}>
        <Field name="id" component={ReduxFormControl} type="text" />
      </Col>
    </FormGroup>
  </Form>
)

const mapStateToProps = (state) => {
  const id = selectImageId(state)
  return {
    initialValues: {
      id
    }
  }
}

ImageDataForm = reduxForm({
  form: 'ImagePage/ImageDataForm',
  enableReinitialize: true
})(ImageDataForm)

ImageDataForm.defaultProps = {
}

ImageDataForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(ImageDataForm)

