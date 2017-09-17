import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

class MapInfoEditor extends React.PureComponent {
  render() {
    return (
      <div className={this.props.className}>
        MapInfoEditor
      </div>
    )
  }
}

MapInfoEditor.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object
}

export default MapInfoEditor

