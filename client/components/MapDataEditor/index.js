import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import MapInfoEditor from 'components/MapInfoEditor'
import MapGeometryEditor from 'components/MapGeometryEditor'

class MapDataEditor extends React.PureComponent {
  render() {
    return (
      <div className={this.props.className}>
        <div className="row">
          <MapInfoEditor data={this.props.data} className="col-sm-3" />
          <MapGeometryEditor data={this.props.data} className="col-sm-9" />
        </div>
      </div>
    )
  }
}

MapDataEditor.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object
}

export default MapDataEditor

