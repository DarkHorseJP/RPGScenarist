import React from 'react'
import { connect, dispatch } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { FormattedNumber } from 'react-intl'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import styled from 'styled-components'

import EditableList from 'components/EditableList'
import MapDataEditor from 'components/MapDataEditor'
import { changeMap, makeSelectMapId, makeSelectMapList, makeSelectMapData } from 'redux/modules/map'

class MapEditor extends React.PureComponent {
  render() {
    const content = (
      <div className="row">
        <EditableList 
          className="col-sm-2"
          height="100vh - 50px"
          items={this.props.list}
          selectedId={this.props.id}
          onClick={this.props.onChangeMap}
          onCreate={() => {alert('Create')}}
          onDelete={(id) => {alert('Delete:' + id)}} />
        <MapDataEditor 
          className="col-sm-10"
          data={this.props.data} />
      </div>
    )
    return content
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    onChangeMap: (mapId) => { dispatch(changeMap(mapId)) }
  }
}

const mapStateToProps = createStructuredSelector({
  id: makeSelectMapId(),
  list: makeSelectMapList(),
  data: makeSelectMapData()
})

export default connect(mapStateToProps, mapDispatchToProps)(MapEditor)

