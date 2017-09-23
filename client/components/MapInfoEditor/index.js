import React from 'react'
import PropTypes from 'prop-types'

const MapInfoEditor = ({ className }) => (
  <div className={className}>
    MapInfoEditor
  </div>
)

MapInfoEditor.defaultProps = {
  className: ''
}

MapInfoEditor.propTypes = {
  className: PropTypes.string
}

export default MapInfoEditor

