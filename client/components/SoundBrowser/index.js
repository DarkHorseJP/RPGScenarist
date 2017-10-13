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
  changeSound
} from 'redux/modules/github'
import {
  selectSoundFiles,
  selectSoundId,
  uploadSound,
  isValidSoundFile
} from 'redux/modules/sound'

import Header from './Header'
import Footer from './Footer'

const headerHeight = '40px'
const footerHeight = '40px'
const Wrapper = styled.div`
  height: calc(${(props) => props.height} - ${headerHeight} - ${footerHeight});
  overflow-x: hidden;
  overflow-y: scroll;
`

const SoundBrowser = ({
  search,
  height,
  list,
  selectedId,
  onChangeSound,
  orgName,
  repoName,
  onUploadSound
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
  const sounds = files.map((data, id) => {
    const className = (id === selectedId ? 'active' : '')
    // const src = URL.createObjectURL(data.get('file'))
    const href = (typeof id !== 'undefined' ? `sounds/${id}` : id)
    return (
      <Col sm={4} md={3} lg={2} key={id}>
        <Thumbnail
          src="#"
          href={href}
          onClick={(e) => {
            e.preventDefault()
            onChangeSound(orgName, repoName, id)
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
        onDrop={(file) => onUploadSound(orgName, repoName, file, list)}
      >
        <Header />
        <Row>
          <Wrapper height={height}>
            {sounds}
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
  let soundId = prefix
  let soundNo = 0
  while (list.get(soundId)) {
    soundNo += 1
    soundId = prefix + soundNo
  }
  return soundId
}

const mapDispatchToProps = (dispatch) => ({
  onChangeSound: (org, repo, soundId) => {
    dispatch(changeSound(org, repo, soundId))
    return false
  },
  onUploadSound: (org, repo, files, list) => {
    let soundId = ''
    const promises = files.map((file) => (
      isValidSoundFile(file)
        .then((valid) => {
          if (valid) {
            soundId = getNewId(file.name, list)
            const action = uploadSound(soundId, file)
            dispatch(action)
          }
          return valid
        })
    ))
    Promise.all(promises)
      .then((results) => {
        if (results.find((result) => result === false)) {
          console.error('invalid sound file')
        }
        if (soundId !== '') {
          dispatch(changeSound(org, repo, soundId))
        }
      })
  }
})

const formSelector = formValueSelector('components/SoundBrowser/SearchForm')
const mapStateToProps = createStructuredSelector({
  search: (state) => formSelector(state, 'search'),
  orgName: selectOrganizationName,
  repoName: selectRepositoryName,
  selectedId: selectSoundId,
  list: selectSoundFiles
})

SoundBrowser.defaultProps = {
  search: '',
  height: '100hv',
  orgName: '',
  repoName: '',
  selectedId: '',
  list: fromJS({})
}

SoundBrowser.propTypes = {
  search: PropTypes.string,
  height: PropTypes.string,
  orgName: PropTypes.string,
  repoName: PropTypes.string,
  selectedId: PropTypes.string,
  list: ImmutablePropTypes.map,
  onChangeSound: PropTypes.func.isRequired,
  onUploadSound: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SoundBrowser)

