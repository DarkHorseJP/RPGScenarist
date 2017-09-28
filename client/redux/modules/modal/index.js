import React from 'react'
import { fromJS } from 'immutable'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createSelector, createStructuredSelector } from 'reselect'
import hoistStatics from 'hoist-non-react-statics'

// Constants
const SHOW_MODAL = 'modal/SHOW_MODAL'
const HIDE_MODAL = 'modal/HIDE_MODAL'
const DESTROY_MODAL = 'modal/DESTROY_MODAL'


// Actions
export function showModal(name, props = {}) {
  return {
    type: SHOW_MODAL,
    payload: {
      name,
      props
    }
  }
}

export function hideModal(name) {
  return {
    type: HIDE_MODAL,
    payload: {
      name
    }
  }
}

export function destroyModal(name) {
  return {
    type: DESTROY_MODAL,
    payload: {
      name
    }
  }
}


// Selector
export const selectModal = (state) => state.get('modal')
export const makeSelectModalNamed = (name) => createSelector(
  selectModal,
  (state) => state.get(name) || state.set(name, fromJS({}))
)
export const makeSelectModalIsShown = (name) => createSelector(
  makeSelectModalNamed(name),
  (state) => state.get('isShown')
)
export const makeSelectModalProps = (name) => createSelector(
  makeSelectModalNamed(name),
  (state) => state.get('props') || {}
)


// Initial State
const initialState = fromJS({})

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_MODAL:
      return state.withMutations((s) =>
        s.setIn([action.payload.name, 'isShown'], true)
          .setIn([action.payload.name, 'props'], action.payload.props)
      )
    case HIDE_MODAL:
      return state.setIn([action.payload.name, 'isShown'], false)
    case DESTROY_MODAL:
      return state.delete(action.payload.name)
    default:
      return state
  }
}


// Utility functions
const getDisplayName = (component) => (
  component.displayName || component.name || 'Component'
)

// const isPromise = (obj) => {
//   try {
//     return typeof obj.then === 'function'
//   } catch(e) {
//     return false
//   }
// }

// export function connectModal({ name, resolve, destroyOnHide = true }) {
export function connectModal({ name, destroyOnHide = true }) {
  return (WrappedComponent) => {
    class ConnectModal extends React.Component {
      static displayName = `ConnectModal(${getDisplayName(WrappedComponent)})`

      // componentWillReceiveProps(nextProps) {
      //   const { modalProps, isShown } = nextProps
      // }

      componentWillUnmount() {
        this.props.onDestroy()
      }

      handleHide() {
        this.props.onHide()
      }

      handleDestroy() {
        this.props.onDestroy()
      }

      render() {
        const { isShown, modalProps, onShow, onHide, onDestroy, ...ownProps } = this.props

        if (typeof isShown === 'undefined') {
          return null
        }

        return (
          <WrappedComponent
            {...ownProps}
            {...modalProps}
            show={isShown}
            handleHide={() => this.handleHide()}
            handleDestroy={() => this.handleDestroy()}
          />
        )
      }
    }

    const mapDispatchToProps = (dispatch) => ({
      onShow: () => dispatch(showModal(name)),
      onHide: () => {
        dispatch(hideModal(name))
        if (destroyOnHide) {
          dispatch(destroyModal(name))
        }
      },
      onDestroy: () => dispatch(destroyModal(name))
    })

    const mapStateToProps = createStructuredSelector({
      modalProps: makeSelectModalProps(name),
      isShown: makeSelectModalIsShown(name)
    })

    ConnectModal.defaultProps = {
      isShown: false
    }

    ConnectModal.propTypes = {
      onShow: PropTypes.func.isRequired,
      onHide: PropTypes.func.isRequired,
      onDestroy: PropTypes.func.isRequired,
      modalProps: PropTypes.object.isRequired,
      isShown: PropTypes.bool
    }

    return connect(mapStateToProps, mapDispatchToProps)(
      hoistStatics(ConnectModal, WrappedComponent)
    )
  }
}

