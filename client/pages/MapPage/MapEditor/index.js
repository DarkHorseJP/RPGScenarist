import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import EditableList from 'components/EditableList'
import { changeMap, makeSelectMapId, makeSelectMapList, makeSelectMapData } from 'redux/modules/map'

import MapDataEditor from '../MapDataEditor'

const MapEditor = ({ list, id, onChangeMap, data }) => (
  <div className="row">
    <EditableList
      className="col-sm-2"
      height="100vh - 50px"
      items={list}
      selectedId={id}
      onClick={onChangeMap}
      onCreate={() => { alert('Create') }}
      onDelete={(itemId) => { alert(`Delete:${itemId}`) }}
    />
    <MapDataEditor
      className="col-sm-10"
      data={data}
    />
  </div>
)

const mapDispatchToProps = (dispatch) => ({
  onChangeMap: (mapId) => { dispatch(changeMap(mapId)) }
})

const mapStateToProps = createStructuredSelector({
  id: makeSelectMapId(),
  list: makeSelectMapList(),
  data: makeSelectMapData()
})

MapEditor.defaultProps = {
  onChangeMap: () => {}
}

MapEditor.propTypes = {
  id: PropTypes.string.isRequired,
  list: ImmutablePropTypes.list.isRequired,
  data: ImmutablePropTypes.map.isRequired,
  onChangeMap: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(MapEditor)

