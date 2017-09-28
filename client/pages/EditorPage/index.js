import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
// import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { PageHeader } from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'

import {
  selectInstallationId,
  selectOrganizationName,
  selectRepositoryName,
  setRepositoryInfo
} from 'redux/modules/github'

import CommonHeader from 'containers/CommonHeader'
import EditorHeader from 'containers/EditorHeader'
import Form from './Form'
// import messages from './messages'

class EditorPage extends React.PureComponent {
  componentDidMount() {
  }

  onSubmit(values) {
    const instId = this.props.instId
    const owner = this.props.orgName
    const repo = this.props.repoName
    const name = values.get('name')
    const desc = values.get('description')
    setRepositoryInfo(instId, owner, repo, name, desc)
      .then((res) => alert(`result: ${JSON.stringify(res)}`))
      .catch((err) => alert(`error: ${err}`))
  }

  render() {
    return (
      <div>
        <Helmet title="Editor" />
        <CommonHeader />
        <EditorHeader />
        <PageHeader>Header</PageHeader>
        <Form onSubmit={(values) => this.onSubmit(values)} />
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  instId: selectInstallationId,
  orgName: selectOrganizationName,
  repoName: selectRepositoryName
})

EditorPage.defaultProps = {
  instId: '',
  orgName: '',
  repoName: ''
}

EditorPage.propTypes = {
  instId: PropTypes.string,
  orgName: PropTypes.string,
  repoName: PropTypes.string
}

export default connect(mapStateToProps)(EditorPage)

