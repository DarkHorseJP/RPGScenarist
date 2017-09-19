import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { FormattedNumber } from 'react-intl'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

import { makeSelectMapId } from 'redux/modules/map'

class ItemData extends React.PureComponent {
  render() {
    const item = this.props.item
    const content = (
      <div className={this.props.className}>
        <h1>ItemData</h1>
        ID: {this.props.id}
      </div>
    )
    return content
  }
}

ItemData.propTypes = {
  id: PropTypes.string
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const mapStateToProps = createStructuredSelector({
  id: makeSelectMapId()
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemData)
