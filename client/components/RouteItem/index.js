import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { pathToAction, getOptions } from 'redux-first-router'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { selectLocation } from 'redux/modules/location'
import routesMap from 'redux/routesMap'

class RouteItem extends React.Component {
  render() {
    const { tag, location, dispatch, to, ...props } = this.props
    const { querySerializer } = getOptions()
    const url = to || this.props.href
    const action = pathToAction(url, routesMap, querySerializer)
    const Tag = tag
    return (
      <Tag 
        onClick={(e) => {
          e.preventDefault()
          dispatch(action)
        }}
        active={url == location.pathname}
        {...props} />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  location: selectLocation
})

export default connect(mapStateToProps)(RouteItem)

