import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'
//import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
//import { createStructuredSelector } from 'reselect'

export class HomePage extends React.PureComponent {
  componentDidMount() {
    //this.props.onLoadMaps()
  }
  
  //static get sagas() {
  //  return mapSagas
  //}

  render() {
    return (
      <article>
        <Helmet title="Home" />
        Home
        <Link to="/maps">Map</Link>
      </article>
    )
  }
}

HomePage.propTypes = {
}

export function mapDispatchToProps(dispatch) {
  return {
  }
}

const mapStateToProps = (state) => {return {}}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

