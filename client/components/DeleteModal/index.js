import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { connectModal } from 'redux/modules/modal'

import messages from './messages'

class DeleteModal extends React.PureComponent {
  handleClose() {
    this.props.onDelete(this.props.id)
    this.props.handleHide()
  }

  render() {
    const name = this.props.name

    return (
      <Modal show={this.props.show}>
        <Modal.Header>
          <Modal.Title>
            <FormattedMessage {...messages.wantToDelete} values={{ name }} />:
          </Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <Button onClick={this.props.handleHide}>
            <FormattedMessage {...messages.cancel} />
          </Button>
          <Button bsStyle="danger" onClick={() => this.handleClose()}>
            <FormattedMessage {...messages.delete} />
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

DeleteModal.defaultProps = {
  show: false,
  onDelete: () => {}
}

DeleteModal.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  show: PropTypes.bool,
  onDelete: PropTypes.func,
  handleHide: PropTypes.func.isRequired
}

DeleteModal.formName = 'components.DeleteModal'

export default connectModal({ name: DeleteModal.formName })(DeleteModal)

