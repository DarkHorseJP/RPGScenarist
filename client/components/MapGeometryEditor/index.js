import React from 'react'
import PropTypes from 'prop-types'

const MapGeometryEditor = ({ className }) => (
  <div className={className}>
    MapGeometryEditor
  </div>
)

MapGeometryEditor.defaultProps = {
  className: ''
}

MapGeometryEditor.propTypes = {
  className: PropTypes.string
}

export default MapGeometryEditor

