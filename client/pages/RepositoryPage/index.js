import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { Route, Link } from 'react-router-dom'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { connect } from 'react-redux'
import { Panel, ListGroup, ListGroupItem, PageHeader } from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'

import CommonHeader from 'containers/CommonHeader'
import EditorHeader from 'containers/EditorHeader'
import EditableList from 'components/EditableList'
import OrganizationList from './OrganizationList'
import RepositoryList from './RepositoryList'
import messages from './messages'

import { 
  changeOrganization,
  changeRepository,
  makeSelectOrganization,
  makeSelectOrganizationList,
  makeSelectRepository,
  makeSelectRepositoryList,
  loadOrganizations,
  loadRepositories
} from 'redux/modules/github'

class RepositoryPage extends React.Component {
  componentDidMount() {
    this.props.onLoadOrganizations()
  }
  
  render() {
    return (
      <div>
        <Helmet title="Repository" />
        <CommonHeader />
        <div className="row" style={{margin: 0}}>
          <div className="col-sm-3" style={{padding: '15px'}}>
            <OrganizationList 
              list={this.props.orgList} 
              selected={this.props.org ? this.props.org.get('id') : ''} 
            />
          </div>
          <div className="col-sm-9">
            <RepositoryList
              list={this.props.repoList}
              selected={this.props.repo ? this.props.repo.get('id') : ''}
            />
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
  org: makeSelectOrganization(),
  orgList: makeSelectOrganizationList(),
  repo: makeSelectRepository(),
  repoList: makeSelectRepositoryList(),
})

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryPage)

