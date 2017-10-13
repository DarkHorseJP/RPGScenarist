import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import {
  Form,
  FormGroup,
  InputGroup,
  Glyphicon
} from 'react-bootstrap'

import ReduxFormControl from 'components/ReduxFormControl'

const SearchForm = () => (
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

export const searchFormName = 'components/AssetBrowser/SearchForm'
const ReduxSearchForm = reduxForm({ form: searchFormName })(SearchForm)
const Header = () => (<ReduxSearchForm />)

export default Header

