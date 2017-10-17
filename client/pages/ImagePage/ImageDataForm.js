import React from 'react'
import PropTypes from 'prop-types'
import { Thumbnail } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import AssetDataForm, { FormGroupRow } from 'components/AssetDataForm'

import messages from './messages'

const imageLabel = (<FormattedMessage {...messages.image} />)
const ImageThumbnail = ({ src }) => (
  <FormGroupRow label={imageLabel}>
    <Thumbnail src={src} />
  </FormGroupRow>
)
ImageThumbnail.propTypes = {
  src: PropTypes.string.isRequired
}

const ImageDataForm = ({ height }) => (
  <AssetDataForm
    module="image"
    category="images"
    height={height}
  >
    {ImageThumbnail}
  </AssetDataForm>
)

ImageDataForm.defaultProps = {
  height: ''
}

ImageDataForm.propTypes = {
  height: PropTypes.string
}

export default ImageDataForm

