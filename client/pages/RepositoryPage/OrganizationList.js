import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS } from 'immutable'
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap'

import RouteItem from 'components/RouteItem'

export default class OrganizationList extends React.Component {
  render() {
    return (
      <Panel collapsible defaultExpanded header="Organization">
        <ListGroup fill>
          {this.props.list.map(org => (
            <RouteItem 
              key={org.get('id')}
              element={ListGroupItem} 
              href={`/orgs/${org.get('id')}/repos`}>
              {org.getIn(['account', 'login'])}
            </RouteItem>
          ))}
        </ListGroup>
      </Panel>
    )
  }
}

OrganizationList.defaultProps = {
  list: fromJS([]),
  selected: ''
}

OrganizationList.propTypes = {
  list: ImmutablePropTypes.list,
  selected: PropTypes.string
}

