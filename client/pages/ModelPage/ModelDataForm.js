import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { Form, FormGroup, FormControl, Button, Row, Col, ControlLabel, Panel } from 'react-bootstrap'
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl'
import styled from 'styled-components'

import { showModal } from 'redux/modules/modal'
import {
  selectModelId,
  //  selectModelUrl,
  selectModelInfo,
  selectAllModelTags,
  selectAllModelIds,
  setModelTags,
  deleteModel
} from 'redux/modules/model'
import ReduxFormControl from 'components/ReduxFormControl'
import TagEditor from 'components/TagEditor'
import DeleteModal from 'components/DeleteModal'
import SCNViewer from 'components/SCNViewer'

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

let ModelDataForm = ({
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
  const modelLabel = (<FormattedMessage {...messages.model} />)

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
              <TagEditor
                tags={tags}
                suggestions={suggestions}
                onChange={(newTags) => onChangeTags(id, newTags)}
              />
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Row>
            <Col componentClass={ControlLabel} sm={3}>
              {modelLabel}
            </Col>
            <Col sm={9}>
              <Panel>
                <SCNViewer
                  model={src}
                  onError={(err) => console.error(`Viewer error: ${typeof err} ${Object.keys(err)} ${err}`)}
                />
              </Panel>
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
    dispatch(setModelTags(id, tags))
  },
  onShowDelete: () => {
    dispatch(showModal(DeleteModal.formName))
  },
  onDelete: (id) => {
    dispatch(deleteModel(id))
  }
})

const mapStateToProps = (state) => {
  // TODO: get model size (width x height)
  const id = selectModelId(state)
  // const src = selectModelUrl(state)
  const info = selectModelInfo(state)
  const path = info ? info.get('path') : ''
  const updated = info ? info.get('updated') : ''
  const tags = info ? info.get('tags') : null
  const tagArray = tags ? tags.toArray() : []
  const suggestions = selectAllModelTags(state).slice()
  const ids = selectAllModelIds(state)

  console.log(`id: ${id}`)

  // const owner = selectOwner(state)
  // const repo = selectRepo(state)
  // const user = selectUser(state)
  // const branch = `user/${user}`
  const owner = 'TestOrganizationForGitHubApps'
  const repo = 'TestRepository3'
  const user = 'magicien'
  const branch = `user/${user}`
  const src = id ? `https://cdn.rawgit.com/${owner}/${repo}/${branch}/models/${id}/${path}` : ''

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

ModelDataForm = reduxForm({
  form: 'ModelPage/ModelDataForm',
  enableReinitialize: true,
  validate: validations
})(ModelDataForm)

ModelDataForm.defaultProps = {
  height: '',
  id: '',
  src: '',
  path: '',
  updated: '',
  tags: [],
  suggestions: [],
  ids: []
}

ModelDataForm.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ModelDataForm)

