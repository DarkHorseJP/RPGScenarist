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

import {
  selectOrganizationName,
  selectRepositoryName
} from 'redux/modules/github'
import {
  makeSelectors,
  uploadAsset,
  changeAsset
} from 'redux/modules/asset'

import Header, { searchFormName } from './Header'
import Footer from './Footer'

const headerHeight = '40px'
const footerHeight = '40px'
const Wrapper = styled.div`
  height: calc(${(props) => props.height} - ${headerHeight} - ${footerHeight});
  overflow-x: hidden;
  overflow-y: scroll;
`

const defaultGroupComponent = ({ children }) => (<Row>{children}</Row>)
defaultGroupComponent.propTypes = {
  children: PropTypes.node.isRequired
}

const defaultItemComponent = ({
  category,
  id,
  active,
  file,
  handleClick
}) => {
  const src = URL.createObjectURL(file)
  const href = (active ? `${category}/${id}` : id)
  const className = (active ? 'active' : '')
  return (
    <Col sm={4} md={3} lg={2}>
      <Thumbnail
        src={src}
        href={href}
        className={className}
        onClick={handleClick}
      >
        {id}
      </Thumbnail>
    </Col>
  )
}
defaultItemComponent.propTypes = {
  category: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  file: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
}

const getNewId = (name, list) => {
  const prefix = name.split('.')[0]
  let assetId = prefix
  let assetNo = 0
  while (list.get(assetId)) {
    assetNo += 1
    assetId = prefix + assetNo
  }
  return assetId
}

const AssetBrowser = ({
  module,
  category,
  groupComponent,
  itemComponent,
  assetName,
  filesName,
  validate,
  height,
  onChange
}) => {
  const selectors = makeSelectors(module)
  const _AssetBrowser = ({ // eslint-disable-line no-underscore-dangle
    search,
    orgName,
    repoName,
    selectedId,
    list,

    handleChange,
    onUpload,

    sort
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
    files = sort(files.sortBy.bind(files))

    const GroupComponent = groupComponent
    const ItemComponent = itemComponent
    /* eslint-disable react/no-array-index-key */
    const assets = files.map((data, id) => (
      <ItemComponent
        key={id}
        orgName={orgName}
        repoName={repoName}
        category={category}
        id={id}
        active={(id === selectedId)}
        file={data.get('file')}
        handleClick={(e) => {
          e.preventDefault()
          handleChange(orgName, repoName, category, id)
        }}
      />
    )).toArray()
    /* eslint-enable react/no-array-index-key */

    let dropzoneRef = null
    return (
      <div>
        <Dropzone
          disableClick
          style={{}}
          ref={(node) => { dropzoneRef = node }}
          onDrop={(file) => {
            onUpload(orgName, repoName, category, file, list)
              .then((newId) => {
                onChange(orgName, repoName, category, newId)
              })
          }}
        >
          <Header />
          <Wrapper height={height}>
            <GroupComponent>
              {assets}
            </GroupComponent>
          </Wrapper>
          <Footer
            assetName={assetName}
            filesName={filesName}
            onClick={() => {
              dropzoneRef.open()
            }}
          />
        </Dropzone>
      </div>
    )
  }


  const mapDispatchToProps = (dispatch) => ({
    handleChange: (org, repo, cat, id) => {
      onChange(org, repo, cat, id)
    },
    onUpload: (org, repo, cat, files, list) => {
      let assetId = ''
      const promises = files.map((file) => (
        validate(file)
          .then((valid) => {
            if (valid) {
              assetId = getNewId(file.name, list)
              const action = uploadAsset(cat, assetId, file)
              dispatch(action)
            }
            return valid
          })
      ))
      return Promise.all(promises)
        .then((results) => {
          if (results.find((result) => result === false)) {
            console.error('invalid file')
          }
          return assetId
        })
    }
  })

  const formSelector = formValueSelector(searchFormName)
  const mapStateToProps = createStructuredSelector({
    search: (state) => formSelector(state, 'search'),
    orgName: selectOrganizationName,
    repoName: selectRepositoryName,
    selectedId: selectors.selectId,
    list: selectors.selectFiles
  })

  _AssetBrowser.defaultProps = {
    search: '',
    orgName: '',
    repoName: '',
    selectedId: '',
    list: fromJS({}),
    sort: (sortBy) => sortBy(
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
  }

  _AssetBrowser.propTypes = {
    search: PropTypes.string,
    orgName: PropTypes.string,
    repoName: PropTypes.string,
    selectedId: PropTypes.string,
    list: ImmutablePropTypes.map,
    sort: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired
  }

  const Browser = connect(mapStateToProps, mapDispatchToProps)(_AssetBrowser)
  return (<Browser />)
}

AssetBrowser.defaultProps = {
  groupComponent: defaultGroupComponent,
  itemComponent: defaultItemComponent,
  validate: () => Promise.resolve(true),
  height: '100hv',
  onChange: (dispatch, org, repo, category, id) => {
    dispatch(changeAsset(org, repo, category, id))
  }
}

AssetBrowser.propTypes = {
  module: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  groupComponent: PropTypes.func,
  itemComponent: PropTypes.func,
  assetName: PropTypes.string.isRequired,
  filesName: PropTypes.string.isRequired,
  validate: PropTypes.func,
  height: PropTypes.string,
  onChange: PropTypes.func
}

export default AssetBrowser

