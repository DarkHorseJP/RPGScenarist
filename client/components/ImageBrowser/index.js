import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Row, Col, Thumbnail } from 'react-bootstrap'
import styled from 'styled-components'
import { formValueSelector } from 'redux-form/immutable'
import Dropzone from 'react-dropzone'

// import { createGameImage } from 'components/GameImage'
import {
  selectOrganizationName,
  selectRepositoryName,
  changeImage
} from 'redux/modules/github'
import {
  selectImageFiles,
  selectImageId,
  uploadImage,
  isValidImageFile
} from 'redux/modules/image'

import Header from './Header'
import Footer from './Footer'

const headerHeight = '40px'
const footerHeight = '40px'
const Wrapper = styled.div`
  height: calc(${(props) => props.height} - ${headerHeight} - ${footerHeight});
  overflow-x: hidden;
  overflow-y: scroll;
`

const ImageBrowser = ({
  search,
  height,
  list,
  selectedId,
  onChangeImage,
  orgName,
  repoName,
  onUploadImage
}) => {
  let files = list
  if (search !== '') {
    files = files.filter((file, id) => {
      if (id.indexOf(search) >= 0) {
        return true
      }
      const tags = file.getIn(['meta', 'tags'])
      if (!tags) {
        return false
      }
      const t = tags.find((tag) => tag === search)
      return (typeof t !== 'undefined')
    })
  }
  files = files.sortBy(
    (file, id) => id,
    (a, b) => {
      if (a < b) {
        return -1
      }
      if (a > b) {
        return 1
      }
      return 0
    }
  )

  /* eslint-disable react/no-array-index-key */
  const images = files.map((data, id) => {
    const className = (id === selectedId ? 'active' : '')
    const src = URL.createObjectURL(data.get('file'))
    return (
      <Col sm={4} md={3} lg={2} key={id}>
        <Thumbnail
          src={src}
          href={id}
          onClick={(e) => {
            e.preventDefault()
            onChangeImage(orgName, repoName, id)
          }}
          className={className}
        >
          {id}
        </Thumbnail>
      </Col>
    )
  }).toArray()
  /* eslint-enable react/no-array-index-key */

  let dropzoneRef = null
  return (
    <div>
      <Dropzone
        disableClick
        style={{}}
        ref={(node) => { dropzoneRef = node }}
        onDrop={(file) => onUploadImage(orgName, repoName, file, list)}
      >
        <Header />
        <Row>
          <Wrapper height={height}>
            {images}
          </Wrapper>
        </Row>
        <Footer
          onClick={() => {
            dropzoneRef.open()
          }}
        />
      </Dropzone>
    </div>
  )
}

const getNewId = (name, list) => {
  const prefix = name.split('.')[0]
  let imageId = prefix
  let imageNo = 0
  while (list.get(imageId)) {
    imageNo += 1
    imageId = prefix + imageNo
  }
  return imageId
}

const mapDispatchToProps = (dispatch) => ({
  onChangeImage: (org, repo, imageId) => {
    dispatch(changeImage(org, repo, imageId))
    return false
  },
  onUploadImage: (org, repo, files, list) => {
    let imageId = ''
    const promises = files.map((file) => (
      isValidImageFile(file)
        .then((valid) => {
          if (valid) {
            imageId = getNewId(file.name, list)
            const action = uploadImage(imageId, file)
            dispatch(action)
          }
          return valid
        })
    ))
    Promise.all(promises)
      .then((results) => {
        if (results.find((result) => result === false)) {
          console.error('invalid image file')
        }
        if (imageId !== '') {
          dispatch(changeImage(org, repo, imageId))
        }
      })
  }
})

const formSelector = formValueSelector('components/ImageBrowser/SearchForm')
const mapStateToProps = createStructuredSelector({
  search: (state) => formSelector(state, 'search'),
  orgName: selectOrganizationName,
  repoName: selectRepositoryName,
  selectedId: selectImageId,
  list: selectImageFiles
})

ImageBrowser.defaultProps = {
  search: '',
  height: '100hv',
  orgName: '',
  repoName: '',
  selectedId: '',
  list: fromJS({})
}

ImageBrowser.propTypes = {
  search: PropTypes.string,
  height: PropTypes.string,
  orgName: PropTypes.string,
  repoName: PropTypes.string,
  selectedId: PropTypes.string,
  list: ImmutablePropTypes.map,
  onChangeImage: PropTypes.func.isRequired,
  onUploadImage: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageBrowser)

