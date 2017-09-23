import React from 'react'
import PropTypes from 'prop-types'

import MapInfoEditor from 'components/MapInfoEditor'
import MapGeometryEditor from 'components/MapGeometryEditor'

const MapDataEditor = ({ className, data }) => (
  <div className={className}>
    <div className="row">
      <MapInfoEditor data={data} className="col-sm-3" />
      <MapGeometryEditor data={data} className="col-sm-9" />
    </div>
  </div>
)

MapDataEditor.defaultProps = {
  className: '',
  data: {}
}

MapDataEditor.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object
}

export default MapDataEditor

