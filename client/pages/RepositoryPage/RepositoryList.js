import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS } from 'immutable'
import Link from 'redux-first-router-link'
import { Panel } from 'react-bootstrap'
import { FormattedMessage, FormattedDate } from 'react-intl'

import messages from './messages'

const RepositoryList = ({ list, orgName }) => (
  <div>
    {list.map((repo) => (
      <Panel key={repo.get('id')}>
        <Link to={`/edit/${orgName}/${repo.get('name')}`}>
          <h3>{repo.get('name')}</h3>
        </Link>
        <p>{repo.get('description') || ''}</p>
        <small><FormattedMessage {...messages.updatedAt} /> <FormattedDate value={repo.get('updated_at')} /></small>
      </Panel>
    ))}
  </div>
)

RepositoryList.defaultProps = {
  list: fromJS([]),
  orgName: ''
}

RepositoryList.propTypes = {
  list: ImmutablePropTypes.list,
  orgName: PropTypes.string
}

export default RepositoryList

