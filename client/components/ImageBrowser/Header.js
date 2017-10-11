import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import {
  Form,
  FormGroup,
  InputGroup,
  Glyphicon
} from 'react-bootstrap'

import ReduxFormControl from 'components/ReduxFormControl'

let SearchForm = () => (
  <Form onSubmit={(e) => e.preventDefault()}>
    <FormGroup>
      <InputGroup>
        <InputGroup.Addon>
          <Glyphicon glyph="search" />
        </InputGroup.Addon>
        <Field name="search" component={ReduxFormControl} type="text" />
      </InputGroup>
    </FormGroup>
  </Form>
)
SearchForm = reduxForm({ form: 'components/ImageBrowser/SearchForm' })(SearchForm)
SearchForm = connect()(SearchForm)

const Header = () => (
  <SearchForm />
)

export default Header

