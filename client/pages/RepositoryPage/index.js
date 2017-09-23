import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
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
  selectOrganizationName,
  selectOrganizationList,
  selectRepositoryList
} from 'redux/modules/github'

class RepositoryPage extends React.Component {
  componentDidMount() {
  }
  
  render() {
    const orgName = this.props.orgName || ''
    return (
      <div>
        <Helmet title="Repository" />
        <CommonHeader />
        <div className="row" style={{margin: 0}}>
          <div className="col-sm-3" style={{padding: '15px'}}>
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

//RepositoryPage.propTypes = {
//}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const mapStateToProps = createStructuredSelector({
  orgName: selectOrganizationName,
  orgList: selectOrganizationList,
  repoList: selectRepositoryList
})

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryPage)

