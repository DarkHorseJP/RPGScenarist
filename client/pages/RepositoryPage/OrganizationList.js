import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS } from 'immutable'
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import RouteItem from 'components/RouteItem'

const OrganizationList = ({ list }) => (
  <Panel header="Organization">
    <ListGroup fill>
      {list.map((org) => {
        const orgName = org.getIn(['account', 'login'])
        return (
          <RouteItem
            tag={ListGroupItem}
            key={orgName}
            href={`/edit/${orgName}`}
          >
            {orgName}
          </RouteItem>
        )
      })}
    </ListGroup>
  </Panel>
)

OrganizationList.defaultProps = {
  list: fromJS([])
}

OrganizationList.propTypes = {
  list: ImmutablePropTypes.list
}

export default OrganizationList
