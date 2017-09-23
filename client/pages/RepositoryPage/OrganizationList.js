import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS } from 'immutable'
import Link, { NavLink } from 'redux-first-router-link'
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import RouteItem from 'components/RouteItem'

export default class OrganizationList extends React.Component {
  render() {
    return (
      <Panel header="Organization">
        <ListGroup fill>
          {this.props.list.map(org => {
            const orgName = org.getIn(['account', 'login'])
            return (
              <RouteItem
                tag={ListGroupItem}
                key={orgName}
                href={`/edit/${orgName}`}>
                {orgName}
              </RouteItem>
            )
          })}
        </ListGroup>
      </Panel>
    )
  }
}

OrganizationList.defaultProps = {
  list: fromJS([])
}

OrganizationList.propTypes = {
  list: ImmutablePropTypes.list
}

