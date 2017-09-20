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
  makeSelectRepository,
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
        <Helmet title="Repository" />
        <CommonHeader />
        <EditorHeader />
        <div className="row" style={{marginLeft: 0, marginRight: 0}}>
          <EditableList
            className="col-md-2 col-sm-3"
            style={{paddingLeft: 0, paddingRight: 0}}
            height="100vh - 100px"
            items={this.props.orgList}
            selectedKey={this.props.orgId}
            keyName="id"
            valueName="account.login"
            onClick={this.props.onChangeOrganization} />
          <EditableList
            className="col-md-2 col-sm-3"
            style={{paddingLeft: 0, paddingRight: 0}}
            height="100vh - 100px"
            items={this.props.repoList}
            selectedKey={this.props.repoId}
            keyName="id"
            valueName="name"
            onClick={this.props.onChangeRepository} />
          <div className="col-md-8 col-sm-6">
            Repository Info
            <div>
              {this.props.repo ? this.props.repo.get('name') : ''}
            </div>
          </div>
        </div>
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
  orgId: makeSelectOrganizationId(),
  orgList: makeSelectOrganizationList(),
  repoId: makeSelectRepositoryId(),
  repoList: makeSelectRepositoryList(),
  repo: makeSelectRepository()
})

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryPage)

