import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Row, Col } from 'react-bootstrap'

import { createGameImage } from 'components/GameImage'
import {
  selectOrganizationName,
  selectRepositoryName,
  selectGameImages,
  changeImage
} from 'redux/modules/github'
import {
  selectImageId
} from 'redux/modules/image'

const ImageBrowser = ({ list, selectedId, onChangeImage, orgName, repoName }) => {
  const images = list.map((image) => {
    const id = image.get('id')
    const active = (id === selectedId)
    const GameImage = createGameImage(id)
    return (
      <Col sm={4} key={id}>
        <GameImage href="#" onClick={() => onChangeImage(orgName, repoName, id)} active={active}>
          {id}
        </GameImage>
      </Col>
    )
  })

  return (
    <Row>
      {images}
    </Row>
  )
}

//      onClick={(imageId) => onChangeImage(orgName, repoName, imageId)}
//      onCreate={() => { alert('Create') }}
//      onDelete={(itemId) => { alert(`Delete:${itemId}`) }}
//    />

const mapDispatchToProps = (dispatch) => ({
  onChangeImage: (orgName, repoName, imageId) => {
    dispatch(changeImage(orgName, repoName, imageId))
  }
})

const mapStateToProps = createStructuredSelector({
  orgName: selectOrganizationName,
  repoName: selectRepositoryName,
  selectedId: selectImageId,
  list: selectGameImages
})

ImageBrowser.defaultProps = {
  orgName: '',
  repoName: '',
  selectedId: '',
  list: fromJS([])
}

ImageBrowser.propTypes = {
  orgName: PropTypes.string,
  repoName: PropTypes.string,
  selectedId: PropTypes.string,
  list: ImmutablePropTypes.list,
  onChangeImage: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageBrowser)

