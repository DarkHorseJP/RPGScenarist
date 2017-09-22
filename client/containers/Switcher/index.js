import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Transition } from 'transition-group'
import universal from 'react-universal-component'

import { selectPage } from 'redux/modules/location'

const UniversalComponent = universal(props => import(`pages/${props.page}`), {
  minDelay: 500,
  chunkName: props => props.page
})

const Switcher = (props) => {
  return (
    <Transition key={props.page}>
      <UniversalComponent page={props.page} />
    </Transition>
  )
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const mapStateToProps = createStructuredSelector({
  page: selectPage
})

export default connect(mapStateToProps, mapDispatchToProps)(Switcher)

