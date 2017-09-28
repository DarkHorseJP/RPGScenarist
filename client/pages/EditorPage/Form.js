import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { Button, Form, FormGroup, Col, ControlLabel } from 'react-bootstrap'

import ReduxFormControl from 'components/ReduxFormControl'
import { selectRepository } from 'redux/modules/github'

let EditorForm = ({ handleSubmit }) => (
  <Form horizontal onSubmit={handleSubmit}>
    <FormGroup>
      <Col componentClass={ControlLabel} sm={2}>
        Name
      </Col>
      <Col sm={10}>
        <Field name="name" component={ReduxFormControl} type="text" />
      </Col>
    </FormGroup>
    <FormGroup>
      <Col componentClass={ControlLabel} sm={2}>
        Description
      </Col>
      <Col sm={10}>
        <Field name="description" component={ReduxFormControl} type="text" />
      </Col>
    </FormGroup>
    <FormGroup>
      <Col componentClass={ControlLabel} sm={2}>
          Title
      </Col>
      <Col sm={10}>
        <Field name="title" component={ReduxFormControl} type="text" />
      </Col>
    </FormGroup>
    <FormGroup>
      <Col smOffset={2} sm={10}>
        <Button type="submit">Submit</Button>
      </Col>
    </FormGroup>
  </Form>
)
const mapDispatchToProps = () => ({})

const mapStateToProps = (state) => {
  const repo = selectRepository(state)
  const description = (repo && repo.get('description')) || ''
  return {
    initialValues: {
      description,
      title: 'Title'
    }
  }
}
EditorForm = reduxForm({ form: 'EditorPage/Form' })(EditorForm)

EditorForm.defaultProps = {
}

EditorForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorForm)

