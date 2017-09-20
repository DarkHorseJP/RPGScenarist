import React from 'react'
import { Route } from 'react-router-dom'

export default class RouteItem extends React.Component {
  render() {
    const { href, element, ...props } = this.props
    const Item = element
    return (
      <Route
        path={href}
        children={({ match, history }) => (
          <Item
            onClick={e => history.push(href)}
            {...props}
            active={match}>
            {this.props.children}
          </Item>
        )}
      />
    )
  }
}

