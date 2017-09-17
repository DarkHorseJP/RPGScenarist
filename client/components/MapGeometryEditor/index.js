import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

class MapGeometryEditor extends React.PureComponent {
  render() {
    return (
      <div className={this.props.className}>
        MapGeometryEditor
      </div>
    )
  }
}

MapGeometryEditor.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object
}

export default MapGeometryEditor

