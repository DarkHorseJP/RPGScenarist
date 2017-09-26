import React from 'react'
import PropTypes from 'prop-types'

const ListFooter = ({ onCreate, onDelete }) => (
  <div>
    <button onClick={onCreate}>+</button>
    <button onClick={onDelete}>-</button>
  </div>
)

ListFooter.defaultProps = {
  onCreate: () => {},
  onDelete: () => {}
}

ListFooter.propTypes = {
  onCreate: PropTypes.func,
  onDelete: PropTypes.func
}

export default ListFooter

