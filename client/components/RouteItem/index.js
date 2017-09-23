import React from 'react'
import PropTypes from 'prop-types'
import { pathToAction, getOptions } from 'redux-first-router'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { selectLocation } from 'redux/modules/location'
import routesMap from 'redux/routes/map'

const RouteItem = ({ tag, location, dispatch, to, ...props }) => {
  const { querySerializer } = getOptions()
  const url = to || props.href
  const action = pathToAction(url, routesMap, querySerializer)
  const Tag = tag
  return (
    <Tag
      onClick={(e) => {
        e.preventDefault()
        dispatch(action)
      }}
      active={url === location.pathname}
      {...props}
    />
  )
}

const mapStateToProps = createStructuredSelector({
  location: selectLocation
})

RouteItem.defaultProps = {
  tag: 'div',
  to: undefined,
  href: undefined
}

RouteItem.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.func
  ]),
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  to: PropTypes.string,
  href: PropTypes.string
}

export default connect(mapStateToProps)(RouteItem)

