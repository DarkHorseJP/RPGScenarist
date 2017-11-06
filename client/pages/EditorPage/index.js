import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import Link from 'redux-first-router-link'
import { Table } from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'

import {
  selectOrganizationName,
  selectRepositoryName
} from 'redux/modules/github'

import CommonHeader from 'components/CommonHeader'
import EditorHeader from 'components/EditorHeader'
import editorMessages from 'components/EditorHeader/messages'

const pageNames = [
  'general',
  'releases',
  'maps',
  'battle',
  'database',
  'models',
  'motions',
  'images',
  'musics',
  'sounds'
]

const PageRow = ({ repLink, name }) => (
  <tr>
    <th><Link to={`${repLink}/${name}`}><FormattedMessage {...editorMessages[name]} /></Link></th>
    <td><FormattedMessage {...editorMessages[`${name}Help`]} /></td>
  </tr>
)
PageRow.propTypes = {
  repLink: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

class EditorPage extends React.PureComponent {
  render() {
    const { orgName, repoName } = this.props
    const repLink = `/edit/${orgName}/${repoName}`

    return (
      <div>
        <Helmet title="Editor" />
        <CommonHeader />
        <EditorHeader pageName="" />
        <Table bordered condensed>
          <tbody>
            {pageNames.map((name) => (
              <PageRow repLink={repLink} name={name} />
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  orgName: selectOrganizationName,
  repoName: selectRepositoryName
})

EditorPage.defaultProps = {
  orgName: '',
  repoName: ''
}

EditorPage.propTypes = {
  orgName: PropTypes.string,
  repoName: PropTypes.string
}

export default connect(mapStateToProps)(EditorPage)

