import React from 'react'
import PropTypes from 'prop-types'
import { pathToAction, getOptions } from 'redux-first-router'
import { connect } from 'react-redux'

import routesMap from 'redux/routes/map'

const LinkItem = ({ tag, dispatch, to, ...props }) => {
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
      {...props}
    />
  )
}

LinkItem.defaultProps = {
  tag: 'a',
  to: undefined,
  href: undefined
}

LinkItem.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func
  ]),
  dispatch: PropTypes.func.isRequired,
  to: PropTypes.string,
  href: PropTypes.string
}

export default connect()(LinkItem)

