import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'
import { fromJS } from 'immutable'
import { Panel, PageHeader } from 'react-bootstrap'

import messages from './messages'

export default class RepositoryList extends React.Component {
  render() {
    const org = this.props.list.find(repo => repo.get('id') == this.props.selected)
    if(!org){
      return null
    }
    const orgName = org.getIn(['account', 'login'])
    return (
      <div>
        <PageHeader>{orgName}</PageHeader>
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

