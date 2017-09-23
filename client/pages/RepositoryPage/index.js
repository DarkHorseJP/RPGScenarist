import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS } from 'immutable'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { PageHeader } from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'

import {
  selectOrganizationName,
  selectOrganizationList,
  selectRepositoryList
} from 'redux/modules/github'

import CommonHeader from 'containers/CommonHeader'

import OrganizationList from './OrganizationList'
import RepositoryList from './RepositoryList'

class RepositoryPage extends React.Component {
  componentDidMount() {
  }

  render() {
    const orgName = this.props.orgName || ''
    return (
      <div>
        <Helmet title="Repository" />
        <CommonHeader />
        <div className="row" style={{ margin: 0 }}>
          <div className="col-sm-3" style={{ padding: '15px' }}>
            <OrganizationList list={this.props.orgList} />
          </div>
          <div className="col-sm-9">
            <PageHeader>{orgName}</PageHeader>
            <RepositoryList list={this.props.repoList} orgName={orgName} />
          </div>
        </div>
      </div>
    )
  }
}

// RepositoryPage.propTypes = {
// }

const mapStateToProps = createStructuredSelector({
  orgName: selectOrganizationName,
  orgList: selectOrganizationList,
  repoList: selectRepositoryList
})

RepositoryPage.defaultProps = {
  orgName: '',
  orgList: fromJS([]),
  repoList: fromJS([])
}

RepositoryPage.propTypes = {
  orgName: PropTypes.string,
  orgList: ImmutablePropTypes.list,
  repoList: ImmutablePropTypes.list
}

export default connect(mapStateToProps)(RepositoryPage)

