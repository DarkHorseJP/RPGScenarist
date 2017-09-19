import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
//import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
//import { createStructuredSelector } from 'reselect'

import { loadModels } from 'redux/modules/model'

class ModelPage extends React.PureComponent {
  componentDidMount() {
    this.props.onLoadModels()
  }
  
  render() {
    return (
      <article>
        <Helmet
          title="Model Page"
        />
        Model Page
      </article>
    )
  }
}

ModelPage.propTypes = {
}

function mapDispatchToProps(dispatch) {
  return {
    onLoadModels: () => {
      dispatch(loadModels())
    }
  }
}

const mapStateToProps = (state) => {return {}}

export default connect(mapStateToProps, mapDispatchToProps)(ModelPage)

