import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { Form, FormGroup, FormControl, Button, Row, Col, ControlLabel } from 'react-bootstrap'
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl'
import styled from 'styled-components'
import AudioPlayer from 'react-audioplayer'

import { showModal } from 'redux/modules/modal'
import {
  selectSoundId,
  selectSoundUrl,
  selectSoundInfo,
  selectAllSoundTags,
  selectAllSoundIds,
  setSoundTags,
  deleteSound
} from 'redux/modules/sound'
import ReduxFormControl from 'components/ReduxFormControl'
import TagEditor from 'components/TagEditor'
import DeleteModal from 'components/DeleteModal'

import messages from './messages'

const Wrapper = styled.div`
  height: calc(${(props) => props.height});
  padding: 15px;
  overflow-x: hidden;
  overflow-y: scroll;
`

const LabeledControl = ({ name, label, type }) => (
  <FormGroup>
    <Row>
      <Col componentClass={ControlLabel} sm={3}>
        {label}
      </Col>
      <Col sm={9}>
        <Field
          name={name}
          component={ReduxFormControl}
          type={type}
        />
      </Col>
    </Row>
  </FormGroup>
)

LabeledControl.defaultProps = {
  label: '',
  type: 'text'
}

LabeledControl.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  type: PropTypes.string
}

const StaticControl = ({ label, value }) => (
  <FormGroup>
    <Row>
      <Col componentClass={ControlLabel} sm={3}>
        {label}
      </Col>
      <Col sm={9}>
        <FormControl.Static>{value}</FormControl.Static>
      </Col>
    </Row>
  </FormGroup>
)

StaticControl.defaultProps = {
  label: '',
  value: ''
}

StaticControl.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
}

let SoundDataForm = ({
  handleSubmit, // eslint-disable-line react/prop-types
  onChangeTags,
  onShowDelete,
  onDelete,
  height,
  id,
  src,
  path,
  updated,
  tags,
  suggestions
}) => {
  const updatedDate = (
    <span>
      <FormattedDate value={updated} /> <FormattedTime value={updated} />
    </span>
  )

  if (path === '') {
    return null
  }

  const idLabel = (<FormattedMessage {...messages.id} />)
  const pathLabel = (<FormattedMessage {...messages.path} />)
  const updatedLabel = (<FormattedMessage {...messages.updated} />)
  const tagsLabel = (<FormattedMessage {...messages.tags} />)
  const soundLabel = (<FormattedMessage {...messages.sound} />)

  let player = null

  return (
    <Wrapper height={height}>
      <Form horizontal onSubmit={handleSubmit}>
        <LabeledControl
          name="id"
          label={idLabel}
          type="text"
        />
        <StaticControl label={pathLabel} value={path} />
        <StaticControl label={updatedLabel} value={updatedDate} />
        <FormGroup>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              {tagsLabel}
            </Col>
            <Col sm={9}>
              <FormattedMessage {...messages.addNewTag}>
                {(placeholder) => (
                  <TagEditor
                    tags={tags}
                    placeholder={placeholder}
                    suggestions={suggestions}
                    onChange={(newTags) => onChangeTags(id, newTags)}
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              {soundLabel}
            </Col>
            <Col sm={9}>
              <AudioPlayer
                width="100%"
                playlist={[{
                  name: id,
                  src
                }]}
                ref={(audioPlayer) => {
                  if (!audioPlayer) {
                    return
                  }
                  player = audioPlayer
                  player.togglePlayPause = (e) => {
                    const element = player.audioElement
                    if (e) {
                      e.preventDefault()
                    }
                    if (player.state.playing) {
                      element.pause()
                    } else {
                      if (element.currentTime === element.duration) {
                        player.setState({ progress: 0 })
                        element.currentTime = 0
                      }
                      element.play()
                    }
                  }
                  player.handleEndedProgress = () => {}
                  player.playNext = true
                  player.loadSrc()
                }}
              />
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Button bsStyle="danger" className="pull-right" onClick={() => onShowDelete()}>
            <FormattedMessage {...messages.delete} />
          </Button>
          <DeleteModal
            id={id}
            name={id}
            onDelete={onDelete}
          />
        </FormGroup>
      </Form>
    </Wrapper>
  )
}

const validations = (values, { id, ids }) => {
  const errors = {}

  const newId = values.get('id')
  if (id !== newId) {
    if (!newId) {
      errors.id = messages.required
    } else if (!newId.match(/^[a-zA-z0-9_-]+$/)) {
      errors.id = messages.invalidId
    } else if (ids.indexOf(newId) >= 0 && id !== newId) {
      errors.id = messages.usedId
    }
  }

  return errors
}

const mapDispatchToProps = (dispatch) => ({
  onChangeTags: (id, tags) => {
    dispatch(setSoundTags(id, tags))
  },
  onShowDelete: () => {
    dispatch(showModal(DeleteModal.formName))
  },
  onDelete: (id) => {
    dispatch(deleteSound(id))
  }
})

const mapStateToProps = (state) => {
  const id = selectSoundId(state)
  const src = selectSoundUrl(state)
  const info = selectSoundInfo(state)
  const path = info ? info.get('path') : ''
  const updated = info ? info.get('updated') : ''
  const tags = info ? info.get('tags') : null
  const tagArray = tags ? tags.toArray() : []
  const suggestions = selectAllSoundTags(state).slice()
  const ids = selectAllSoundIds(state)

  // remove existing tags from suggestions
  tagArray.forEach((tag) => {
    const index = suggestions.indexOf(tag)
    if (index >= 0) {
      suggestions.splice(index, 1)
    }
  })

  return {
    id,
    src,
    path,
    updated,
    tags: tagArray,
    suggestions,
    ids,
    initialValues: {
      id
    }
  }
}

SoundDataForm = reduxForm({
  form: 'SoundPage/SoundDataForm',
  enableReinitialize: true,
  validate: validations
})(SoundDataForm)

SoundDataForm.defaultProps = {
  height: '',
  id: '',
  src: '',
  path: '',
  updated: '',
  tags: [],
  suggestions: [],
  ids: []
}

SoundDataForm.propTypes = {
  onChangeTags: PropTypes.func.isRequired,
  onShowDelete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  height: PropTypes.string,
  id: PropTypes.string,
  src: PropTypes.string,
  path: PropTypes.string,
  updated: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  suggestions: PropTypes.arrayOf(PropTypes.string),
  ids: PropTypes.arrayOf(PropTypes.string)
}

export default connect(mapStateToProps, mapDispatchToProps)(SoundDataForm)

