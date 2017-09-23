import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { Button, Form, FormGroup, Col, ControlLabel } from 'react-bootstrap'

import ReduxFormControl from 'components/ReduxFormControl'
import { selectRepository } from 'redux/modules/github'

let EditorForm = (props) => {
  return (
    <Form horizontal onSubmit={props.handleSubmit}>
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
}
EditorForm = reduxForm({form: 'EditorPage/Form'})(EditorForm)

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(EditorForm)

