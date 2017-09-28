import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS } from 'immutable'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { PageHeader, Button } from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'
// import { FormattedMessage, FormattedDate } from 'react-intl'
// import { show } from 'redux-modal'

import {
  selectInstallationId,
  selectOrganizationName,
  selectOrganizationList,
  selectRepositoryList,
  createRepository
} from 'redux/modules/github'
import {
  showModal
} from 'redux/modules/modal'

import CommonHeader from 'containers/CommonHeader'

import CreateRepositoryModal from './CreateRepositoryModal'
import OrganizationList from './OrganizationList'
import RepositoryList from './RepositoryList'
// import messages from './messages'

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
            <Button bsStyle="primary" onClick={() => this.props.onShowDialog()}>
              Create Repository
            </Button>
            <CreateRepositoryModal
              onCreateRepository={(repoName) => {
                createRepository(
                  this.props.instId,
                  this.props.orgName,
                  repoName
                )
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  onShowDialog: () => {
    dispatch(showModal('test'))
  }
})

const mapStateToProps = createStructuredSelector({
  instId: selectInstallationId,
  orgName: selectOrganizationName,
  orgList: selectOrganizationList,
  repoList: selectRepositoryList
})

RepositoryPage.defaultProps = {
  instId: '',
  orgName: '',
  orgList: fromJS([]),
  repoList: fromJS([])
}

RepositoryPage.propTypes = {
  onShowDialog: PropTypes.func.isRequired,
  instId: PropTypes.string,
  orgName: PropTypes.string,
  orgList: ImmutablePropTypes.list,
  repoList: ImmutablePropTypes.list
}

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryPage)

