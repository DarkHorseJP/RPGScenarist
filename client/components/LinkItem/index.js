import React from 'react'
import { pathToAction, getOptions } from 'redux-first-router'
import { connect } from 'react-redux'

import routesMap from 'redux/routes/map'

class LinkItem extends React.Component {
  render() {
    const { tag, dispatch, to, ...props } = this.props
    const { querySerializer } = getOptions()
    const url = to || this.props.href
    const action = pathToAction(url, routesMap, querySerializer)
    const Tag = tag || 'a'
    return (
      <Tag 
        onClick={(e) => {
          e.preventDefault()
          dispatch(action)
        }}
        {...props} />
    )
  }
}

export default connect()(LinkItem)

