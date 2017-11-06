import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Form, FormGroup } from 'react-bootstrap'
// import { connectModal } from 'redux-modal'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'

import { connectModal } from 'redux/modules/modal'
import ReduxFormControl from 'components/ReduxFormControl'

import messages from './messages'

const InnerForm = ({ handleSubmit }) => ( // eslint-disable-line react/prop-types
  <Form onSubmit={handleSubmit}>
    <FormGroup>
      <Field name="repositoryName" component={ReduxFormControl} type="text" />
    </FormGroup>
  </Form>
)
const formName = 'RepositoryPage/CreateRepositoryModal/Form'
const NameForm = reduxForm({ form: formName })(InnerForm)
const FormSelector = formValueSelector(formName)

class CreateRepositoryModal extends React.PureComponent {
  handleClose() {
    this.props.onCreateRepository(this.props.repositoryName)
    this.props.handleHide()
  }

  render() {
    return (
      <Modal show={this.props.show}>
        <Modal.Header>
          <Modal.Title>
            <FormattedMessage {...messages.newRepositoryName} />:
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <NameForm onSubmit={() => {
            this.handleClose()
          }}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={(e) => {
            e.preventDefault()
            this.props.handleHide()
          }}
          >
            <FormattedMessage {...messages.cancel} />
          </Button>
          <Button
            bsStyle="primary"
            onClick={(e) => {
              e.preventDefault()
              this.handleClose()
            }}
          >
            <FormattedMessage {...messages.create} />
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  repositoryName: FormSelector(state, 'repositoryName')
})

CreateRepositoryModal.defaultProps = {
  repositoryName: '',
  show: false
}

CreateRepositoryModal.propTypes = {
  onCreateRepository: PropTypes.func.isRequired,
  handleHide: PropTypes.func.isRequired,
  repositoryName: PropTypes.string,
  show: PropTypes.bool
}

export default connectModal({ name: 'RepositoryPage/CreateRepositoryModal' })(
  connect(mapStateToProps)(CreateRepositoryModal)
)

