import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import styled from 'styled-components'

import ListFooter from './ListFooter'

const Wrapper = styled.div`
  height: calc(${props => props.height || '100hv'} - 30px);
  overflow-y: scroll;
`

class EditableList extends React.PureComponent {
  getKeyPath(item, path) {
    const paths = path.split('.')
    return paths.reduce((item, path) => item.get(path), item)
  }

  render() {
    const content = (
      <div className={this.props.className}>
        <Wrapper height={this.props.height}>
          <ListGroup>
            {this.props.items.map(item => {
              //const key = item.get(this.props.keyName)
              //const value = item.get(this.props.valueName)
              const key = this.getKeyPath(item, this.props.keyName)
              const value = this.getKeyPath(item, this.props.valueName)
              return <ListGroupItem key={key} onClick={() => {this.props.onClick(key)}} active={key===this.props.selectedKey}>{value}</ListGroupItem>
            })}
          </ListGroup>
        </Wrapper>
        <ListFooter onCreate={this.props.onCreate} onDelete={() => this.props.onDelete(this.props.selectedKey)} />
      </div>
    )
    return content
  }
}

EditableList.defaultProps = {
  keyName: 'id',
  valueName: 'id'
}

EditableList.propTypes = {
  className: PropTypes.string,
  height: PropTypes.string,
  items: ImmutablePropTypes.list,
  selectedKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  keyName: PropTypes.string,
  valueName: PropTypes.string,
  onClick: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func
}

export default EditableList
