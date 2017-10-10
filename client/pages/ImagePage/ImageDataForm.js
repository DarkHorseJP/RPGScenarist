import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { Form, FormGroup, FormControl, Button, Row, Col, ControlLabel, Thumbnail } from 'react-bootstrap'
import { FormattedDate, FormattedTime } from 'react-intl'
import styled from 'styled-components'

import ReduxFormControl from 'components/ReduxFormControl'
import TagEditor from 'components/TagEditor'
import {
  selectImageId,
  selectImageUrl,
  selectImageInfo,
  setImageTags
} from 'redux/modules/image'

const Wrapper = styled.div`
  height: calc(${(props) => props.height});
  padding: 15px;
  overflow-x: hidden;
  overflow-y: scroll;
`

const LabeledControl = ({ name, label, type }) => (
  <FormGroup>
    <Row>
      <Col componentClass={ControlLabel} sm={2}>
        {label}
      </Col>
      <Col sm={10}>
        <Field name={name} component={ReduxFormControl} type={type} />
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
      <Col componentClass={ControlLabel} sm={2}>
        {label}
      </Col>
      <Col sm={10}>
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
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
}

let ImageDataForm = ({
  handleSubmit,
  onChangeTags,
  height,
  id,
  src,
  path,
  updated,
  tags
}) => {
  const updatedDate = (
    <span>
      <FormattedDate value={updated} /> <FormattedTime value={updated} />
    </span>
  )

  if (path === '') {
    return null
  }

  return (
    <Wrapper height={height}>
      <Form horizontal onSubmit={handleSubmit}>
        <LabeledControl name="id" label="ID" type="text" />
        <StaticControl label="Path" value={path} />
        <StaticControl label="Updated" value={updatedDate} />
        <FormGroup>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Tags
            </Col>
            <Col sm={10}>
              <TagEditor
                tags={tags}
                onChange={(newTags) => onChangeTags(id, newTags)}
              />
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Row>
            <Col componentClass={ControlLabel} sm={2}>
              Image
            </Col>
            <Col sm={10}>
              <Thumbnail src={src} />
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Button bsStyle="danger" className="pull-right">Delete</Button>
        </FormGroup>
      </Form>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch) => ({
  onChangeTags: (id, tags) => {
    dispatch(setImageTags(id, tags))
  }
})

const mapStateToProps = (state) => {
  // TODO: get image size (width x height)
  const id = selectImageId(state)
  const src = selectImageUrl(state)
  const info = selectImageInfo(state)
  const path = info ? info.get('path') : ''
  const updated = info ? info.get('updated') : ''
  const tags = info ? info.get('tags') : null
  const tagArray = tags ? tags.toArray() : []

  return {
    id,
    src,
    path,
    updated,
    tags: tagArray,
    initialValues: {
      id
    }
  }
}

ImageDataForm = reduxForm({
  form: 'ImagePage/ImageDataForm',
  enableReinitialize: true
})(ImageDataForm)

ImageDataForm.defaultProps = {
  onChangeTags: () => {},
  height: '',
  id: '',
  src: '',
  path: '',
  updated: '',
  tags: []
}

ImageDataForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onChangeTags: PropTypes.func,
  height: PropTypes.string,
  id: PropTypes.string,
  src: PropTypes.string,
  path: PropTypes.string,
  updated: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string)

}

export default connect(mapStateToProps, mapDispatchToProps)(ImageDataForm)

