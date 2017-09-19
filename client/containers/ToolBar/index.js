import React from 'react'
import { connect, dispatch } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'

import ToolBarButton from 'components/ToolBarButton'

const Wrapper = styled.div`
  height: 50px;
  background-color: lightsteelblue;
`

import { openWindow } from 'redux/modules/window'

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

function mapDispatchToProps(dispatch) {
  return {
    onOpenWindow: (page, features) => { dispatch(openWindow(page, features)) }
  }
}

const mapStateToProps = () => {return {}}

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar)

