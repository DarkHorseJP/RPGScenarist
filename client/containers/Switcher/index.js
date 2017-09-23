import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Transition } from 'transition-group'
import universal from 'react-universal-component'

import { selectPage } from 'redux/modules/location'

const UniversalComponent = universal((props) => import(`pages/${props.page}`), {
  minDelay: 500,
  chunkName: (props) => props.page
})

const Switcher = ({ page }) => (
  <Transition key={page}>
    <UniversalComponent page={page} />
  </Transition>
)

const mapStateToProps = createStructuredSelector({
  page: selectPage
})

Switcher.defaultProps = {}

Switcher.propTypes = {
  page: PropTypes.node.isRequired
}

export default connect(mapStateToProps)(Switcher)

