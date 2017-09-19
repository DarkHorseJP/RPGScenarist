import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
//import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import CommonHeader from 'containers/CommonHeader'
import EditorHeader from 'containers/EditorHeader'
import EditableList from 'components/EditableList'

import { 
  changeOrganization,
  changeRepository,
  makeSelectOrganizationId,
  makeSelectOrganizationList,
  makeSelectRepositoryId,
  makeSelectRepositoryList,
  loadOrganizations,
  loadRepositories
} from 'redux/modules/github'

class RepositoryPage extends React.PureComponent {
  componentDidMount() {
    this.props.onLoadOrganizations()
  }
  
  render() {
    return (
      <div>
        <Helmet title="Repository Page" />
        <CommonHeader />
        <EditorHeader />
        Repository Page
        <EditableList
          items={this.props.list}
          selectedKey={this.props.id}
          keyName="id"
          valueName="account.login"
          onClick={this.props.onChangeOrganization} />
        Repository Info
      </div>
    )
  }
}

//RepositoryPage.propTypes = {
//}

function mapDispatchToProps(dispatch) {
  return {
    onLoadOrganizations: () => {
      dispatch(loadOrganizations())
    },
    onChangeOrganization: (instId) => { 
      dispatch(changeOrganization(instId)) 
      dispatch(loadRepositories(instId))
    },
    onLoadRepositories: (instid) => {
      dispatch(loadRepositories(instId))
    },
    onChangeRepository: (reposId) => { dispatch(changeRepository(reposId)) }
  }
}

const mapStateToProps = createStructuredSelector({
  id: makeSelectOrganizationId(),
  list: makeSelectOrganizationList(),
  //reposId: makeSelectRepositoryId(),
  //repos: makeSelectRepositoryList()
})

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryPage)

