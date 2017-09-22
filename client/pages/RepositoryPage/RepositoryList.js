import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS } from 'immutable'
import Link from 'redux-first-router-link'
import { Panel, PageHeader } from 'react-bootstrap'
import RouteItem from 'components/RouteItem'
import { FormattedMessage, FormattedDate } from 'react-intl'

import messages from './messages'

export default class RepositoryList extends React.Component {
  render() {
    return (
      <div>
        {this.props.list.map(repo => (
          <Panel key={repo.get('id')}>
            <Link to={`/edit/${repo.get('id')}`}>
              <h3>{repo.get('name')}</h3>
            </Link>
            <p>{repo.get('description') || ''}</p>
            <small><FormattedMessage {...messages.updatedAt} /> <FormattedDate value={repo.get('updated_at')} /></small>
          </Panel>
        ))}
      </div>
    )
  }
}

RepositoryList.defaultProps = {
  list: fromJS([]),
  selected: ''
}

RepositoryList.propTypes = {
  list: ImmutablePropTypes.list,
  selected: PropTypes.string
}

