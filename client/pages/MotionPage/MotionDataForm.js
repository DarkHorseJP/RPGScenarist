import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Panel } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import AssetDataForm, { FormGroupRow } from 'components/AssetDataForm'
import SCNViewer from 'components/SCNViewer'

import messages from './messages'

const motionLabel = (<FormattedMessage {...messages.motion} />)
const Motion = ({ organization, repository, user, id, path, info }) => {
  const branch = `user/${user}`
  const src = id ? `https://cdn.rawgit.com/${organization}/${repository}/${branch}/motions/${id}/${path}` : ''
  const scale = info.get('scale') || 1.0
  // upload a default model file
  const modelPath = info.get('previewModel') || 'https://cdn.rawgit.com/TestOrganizationForGitHubApps/TestRepository3/user/magicien/models/miku/MikuV2 wDummy.pmd'
  console.log(`scale: ${scale}`)

  return (
    <FormGroupRow label={motionLabel}>
      <Panel>
        <SCNViewer
          model={modelPath}
          motion={src}
          scale={scale}
          onError={(err) => console.error(`Viewer error: ${err}`)}
        />
      </Panel>
    </FormGroupRow>
  )
}

Motion.propTypes = {
  organization: PropTypes.string.isRequired,
  repository: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  info: ImmutablePropTypes.map.isRequired
}

const MotionDataForm = ({ height }) => (
  <AssetDataForm
    module="motion"
    category="motions"
    height={height}
  >
    {Motion}
  </AssetDataForm>
)

MotionDataForm.defaultProps = {
  height: ''
}

MotionDataForm.propTypes = {
  height: PropTypes.string
}

export default MotionDataForm

