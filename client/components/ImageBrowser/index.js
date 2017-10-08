import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Row, Col, Thumbnail } from 'react-bootstrap'

// import { createGameImage } from 'components/GameImage'
import {
  selectOrganizationName,
  selectRepositoryName,
  changeImage
} from 'redux/modules/github'
import {
  selectImageFiles,
  selectImageId
} from 'redux/modules/image'

const ImageBrowser = ({ list, selectedId, onChangeImage, orgName, repoName }) => {
  /* eslint-disable react/no-array-index-key */
  const images = list.map((file, id) => {
    const active = (id === selectedId)
    const src = URL.createObjectURL(file)
    return (
      <Col sm={4} key={id}>
        <Thumbnail src={src} href="#" onClick={() => onChangeImage(orgName, repoName, id)} active={active}>
          {id}
        </Thumbnail>
      </Col>
    )
  }).toArray()
  /* eslint-enable react/no-array-index-key */

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
  list: selectImageFiles
})

ImageBrowser.defaultProps = {
  orgName: '',
  repoName: '',
  selectedId: '',
  list: fromJS({})
}

ImageBrowser.propTypes = {
  orgName: PropTypes.string,
  repoName: PropTypes.string,
  selectedId: PropTypes.string,
  list: ImmutablePropTypes.map,
  onChangeImage: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageBrowser)

