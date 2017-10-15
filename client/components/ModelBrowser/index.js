import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { connect } from 'react-redux'
import { Row, Col, Thumbnail } from 'react-bootstrap'

import AssetBrowser from 'components/AssetBrowser'
import { isValidModelFile, changeModel } from 'redux/modules/model'

import messages from './messages'

const ModelItemComponent = ({
  id,
  active,
  handleClick
}) => {
  const href = (active ? `sounds/${id}` : id)
  const className = (active ? 'active' : '')
  return (
    <Col sm={4} md={3} lg={2}>
      <Thumbnail
        href={href}
        className={className}
        onClick={handleClick}
      >
        {id}
      </Thumbnail>
    </Col>
  )
}
ModelItemComponent.propTypes = {
  id: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
}

const ModelBrowser = ({ intl, onChange }) => (
  <AssetBrowser
    module="model"
    category="models"
    assetName={intl.formatMessage(messages.assetName)}
    filesName={intl.formatMessage(messages.filesName)}
    fileName={intl.formatMessage(messages.fileName)}
    validate={isValidModelFile}
    groupComponent={Row}
    itemComponent={ModelItemComponent}
    onChange={onChange}
  />
)
ModelBrowser.propTypes = {
  intl: intlShape.isRequired,
  onChange: PropTypes.func.isRequired
}

const mapStateToProps = null

const mapDispatchToProps = (dispatch) => ({
  onChange: (org, repo, category, id) => {
    dispatch(changeModel(org, repo, id))
  }
})

const IntlModelBrowser = injectIntl(ModelBrowser)

export default connect(mapStateToProps, mapDispatchToProps)(IntlModelBrowser)

