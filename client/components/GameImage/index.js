import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Thumbnail } from 'react-bootstrap'

import { makeSelectImageUrl } from 'redux/modules/image'

const GameImage = ({ src, children, dispatch, ...props }) => (
  <Thumbnail src={src} {...props}>
    {children}
  </Thumbnail>
)

export const createGameImage = (id) => {
  const mapStateToProps = createStructuredSelector({
    src: makeSelectImageUrl(id)
  })
  return connect(mapStateToProps)(GameImage)
}

GameImage.defaultProps = {
  children: null
}

GameImage.propTypes = {
  src: PropTypes.string.isRequired,
  children: PropTypes.node,
  dispatch: PropTypes.func.isRequired
}

export default GameImage

