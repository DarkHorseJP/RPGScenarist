import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
//import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

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

export class RepositoryPage extends React.PureComponent {
  componentDidMount() {
    this.props.onLoadOrganizations()
  }
  
  render() {
    return (
      <article>
        <Helmet
          title="Repository Page"
        />
        Repository Page
        <EditableList
          items={this.props.list}
          selectedKey={this.props.id}
          keyName="id"
          valueName="account.login"
          onClick={this.props.onChangeOrganization} />
      </article>
    )
  }
}

//RepositoryPage.propTypes = {
//}

export function mapDispatchToProps(dispatch) {
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
  reposId: makeSelectRepositoryId(),
  repos: makeSelectRepositoryList()
})

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryPage)

