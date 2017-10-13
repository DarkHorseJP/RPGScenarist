import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { connect } from 'react-redux'
import { Row, Col, Thumbnail } from 'react-bootstrap'

import AssetBrowser from 'components/AssetBrowser'
import { isValidImageFile, changeImage } from 'redux/modules/image'

import messages from './messages'

const ImageItemComponent = ({
  id,
  active,
  file,
  handleClick
}) => {
  const src = URL.createObjectURL(file)
  const href = (active ? `sounds/${id}` : id)
  const className = (active ? 'active' : '')
  return (
    <Col sm={4} md={3} lg={2}>
      <Thumbnail
        src={src}
        href={href}
        className={className}
        onClick={handleClick}
      >
        {id}
      </Thumbnail>
    </Col>
  )
}
ImageItemComponent.propTypes = {
  id: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  file: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
}

const ImageBrowser = ({ intl, onChange }) => (
  <AssetBrowser
    module="image"
    category="images"
    assetName={intl.formatMessage(messages.assetName)}
    filesName={intl.formatMessage(messages.filesName)}
    fileName={intl.formatMessage(messages.fileName)}
    validate={isValidImageFile}
    groupComponent={Row}
    itemComponent={ImageItemComponent}
    onChange={onChange}
  />
)
ImageBrowser.propTypes = {
  intl: intlShape.isRequired,
  onChange: PropTypes.func.isRequired
}

const mapStateToProps = null

const mapDispatchToProps = (dispatch) => ({
  onChange: (org, repo, category, id) => {
    dispatch(changeImage(org, repo, id))
  }
})

const IntlImageBrowser = injectIntl(ImageBrowser)

export default connect(mapStateToProps, mapDispatchToProps)(IntlImageBrowser)

