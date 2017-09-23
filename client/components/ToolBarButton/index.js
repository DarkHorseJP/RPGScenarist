import React from 'react'
import PropTypes from 'prop-types'

const ToolBarButton = ({ onClick }) => (
  <button onClick={onClick}>Button</button>
)

ToolBarButton.defaultProps = {
  onClick: () => {}
}

ToolBarButton.propTypes = {
  onClick: PropTypes.func
}

export default ToolBarButton

