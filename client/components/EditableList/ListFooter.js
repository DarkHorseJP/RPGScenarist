import React from 'react'
import PropTypes from 'prop-types'

class ListFooter extends React.PureComponent {
  render() {
    return (
      <div>
        <button onClick={this.props.onCreate}>+</button>
        <button onClick={this.props.onDelete}>-</button>
      </div>
    )
  }
}

ListFooter.defaultProps = {
  onCreate: () => {},
  onDelete: () => {}
}

ListFooter.propTypes = {
  onCreate: PropTypes.func,
  onDelete: PropTypes.func
}

export default ListFooter
