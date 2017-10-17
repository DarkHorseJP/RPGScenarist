import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form/immutable'
import { Form, FormGroup, Button } from 'react-bootstrap'
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl'
import styled from 'styled-components'

import { showModal } from 'redux/modules/modal'
import {
  setAssetTags,
  deleteAsset,
  makeSelectors
} from 'redux/modules/asset'

import TagEditor from 'components/TagEditor'
import DeleteModal from 'components/DeleteModal'

import _FormGroupRow from './FormGroupRow'
import _LabeledControl from './LabeledControl'
import _StaticControl from './StaticControl'

import messages from './messages'

export const FormGroupRow = _FormGroupRow
export const LabeledControl = _LabeledControl
export const StaticControl = _StaticControl

const Wrapper = styled.div`
  height: calc(${(props) => props.height});
  padding: 15px;
  overflow-x: hidden;
  overflow-y: scroll;
`

const idLabel = (<FormattedMessage {...messages.id} />)
const pathLabel = (<FormattedMessage {...messages.path} />)
const updatedLabel = (<FormattedMessage {...messages.updated} />)
const tagsLabel = (<FormattedMessage {...messages.tags} />)

const validations = (ownValidate) => (values, props) => {
  const errors = {}
  const { id, ids } = props

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

  const ownErrors = ownValidate ? ownValidate(values, props) : {}
  Object.assign(errors, ownErrors)

  return errors
}

const AssetDataForm = ({
  module,
  category,
  validate,
  height,
  children
}) => {
  const selectors = makeSelectors(module)
  let _AssetDataForm = (props) => { // eslint-disable-line no-underscore-dangle
    const {
      handleSubmit, // eslint-disable-line react/prop-types
      onChangeTags,
      onShowDelete,
      onDelete,
      id,
      path,
      updated,
      tags,
      suggestions
    } = props

    const updatedDate = (
      <span>
        <FormattedDate value={updated} /> <FormattedTime value={updated} />
      </span>
    )

    if (path === '') {
      return null
    }

    // const ChildNode = children
    // <ChildNode props={props} />
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
          <FormGroupRow label={tagsLabel}>
            <TagEditor
              tags={tags}
              suggestions={suggestions}
              onChange={(newTags) => onChangeTags(id, newTags)}
            />
          </FormGroupRow>
          {children(props)}
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

  const mapDispatchToProps = (dispatch) => ({
    onChangeTags: (id, tags) => {
      dispatch(setAssetTags(category, id, tags))
    },
    onShowDelete: () => {
      dispatch(showModal(DeleteModal.formName))
    },
    onDelete: (id) => {
      dispatch(deleteAsset(category, id))
    }
  })

  const mapStateToProps = (state) => {
    const id = selectors.selectId(state)
    const src = selectors.selectUrl(state)
    const info = selectors.selectInfo(state)
    const path = info ? info.get('path') : ''
    const updated = info ? info.get('updated') : ''
    const tags = info ? info.get('tags') : null
    const tagArray = tags ? tags.toArray() : []
    const suggestions = selectors.selectAllTags(state).slice()
    const ids = selectors.selectAllIds(state)

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
      info,
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

  _AssetDataForm = reduxForm({
    form: 'components/AssetDataForm',
    enableReinitialize: true,
    validate: validations(validate)
  })(_AssetDataForm)

  _AssetDataForm.defaultProps = {
    height: '',
    id: '',
    src: '',
    path: '',
    updated: '',
    tags: [],
    suggestions: [],
    ids: []
  }

  _AssetDataForm.propTypes = {
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

  const DataForm = connect(mapStateToProps, mapDispatchToProps)(_AssetDataForm)
  return (<DataForm />)
}

AssetDataForm.defaultProps = {
  validate: () => ({}),
  height: ''
}

AssetDataForm.propTypes = {
  module: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  validate: PropTypes.func,
  height: PropTypes.string,
  children: PropTypes.func.isRequired
}

export default AssetDataForm

