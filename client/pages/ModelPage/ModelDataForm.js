import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Panel } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import AssetDataForm, { FormGroupRow } from 'components/AssetDataForm'
import SCNViewer from 'components/SCNViewer'

import messages from './messages'

const modelLabel = (<FormattedMessage {...messages.model} />)
const Model = ({ organization, repository, user, id, path, info }) => {
  const branch = `user/${user}`
  const src = id ? `https://cdn.rawgit.com/${organization}/${repository}/${branch}/models/${id}/${path}` : ''
  const scale = info.get('scale') || 1.0
  console.warn(`src: ${src}`)
  console.log(`scale: ${scale}`)

  return (
    <FormGroupRow label={modelLabel}>
      <Panel>
        <SCNViewer
          model={src}
          scale={scale}
          onError={(err) => console.error(`Viewer error: ${err}`)}
        />
      </Panel>
    </FormGroupRow>
  )
}

Model.propTypes = {
  organization: PropTypes.string.isRequired,
  repository: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  info: ImmutablePropTypes.map.isRequired
}

const ModelDataForm = ({ height }) => (
  <AssetDataForm
    module="model"
    category="models"
    height={height}
  >
    {Model}
  </AssetDataForm>
)

ModelDataForm.defaultProps = {
  height: ''
}

ModelDataForm.propTypes = {
  height: PropTypes.string
}

export default ModelDataForm

