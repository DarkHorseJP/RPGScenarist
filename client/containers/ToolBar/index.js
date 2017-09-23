import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'

import ToolBarButton from 'components/ToolBarButton'
import { openWindow } from 'redux/modules/window'

const Wrapper = styled.div`
  height: 50px;
  background-color: lightsteelblue;
`

class ToolBar extends React.PureComponent {
  openWindow(page) {
    const features = {
      width: 600,
      height: 600,
      menubar: 'no',
      toolbar: 'no',
      location: 'no',
      resizable: 'yes',
      status: 'no'
    }
    this.props.onOpenWindow(page, features)
  }

  render() {
    const content = (
      <div className="row">
        <div className="col-sm-12">
          <Wrapper>
            <ToolBarButton onClick={() => this.openWindow('models')} />
          </Wrapper>
        </div>
      </div>
    )
    return content
  }
}

const mapDispatchToProps = (dispatch) => ({
  onOpenWindow: (page, features) => { dispatch(openWindow(page, features)) }
})

const mapStateToProps = () => ({})

ToolBar.defaultProps = {
}

ToolBar.propTypes = {
  onOpenWindow: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar)

