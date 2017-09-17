import React from 'react'

class ToolBarButton extends React.PureComponent {
  render() {
    return (
      <button onClick={this.props.onClick}>Button</button>
    )
  }
}

export default ToolBarButton

