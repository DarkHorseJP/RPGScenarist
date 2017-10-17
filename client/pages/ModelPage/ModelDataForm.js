import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Panel } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import AssetDataForm, { FormGroupRow } from 'components/AssetDataForm'
import SCNViewer from 'components/SCNViewer'

import messages from './messages'

const modelLabel = (<FormattedMessage {...messages.model} />)
const Model = ({ id, path, info }) => {
  const owner = 'TestOrganizationForGitHubApps'
  const repo = 'TestRepository3'
  const user = 'magicien'
  const branch = `user/${user}`
  // const escapedPath = encodeURI(path)
  const src = id ? `https://cdn.rawgit.com/${owner}/${repo}/${branch}/models/${id}/${path}` : ''
  const scale = info.get('scale') || 1.0
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

