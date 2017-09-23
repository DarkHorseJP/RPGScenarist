import React from 'react'
import Helmet from 'react-helmet'
// import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { PageHeader } from 'react-bootstrap'

import CommonHeader from 'containers/CommonHeader'
import EditorHeader from 'containers/EditorHeader'
import Form from './Form'
// import messages from './messages'

class EditorPage extends React.PureComponent {
  componentDidMount() {
  }

  onSubmit(values) {
    alert(`submit: ${JSON.stringify(values)}`)
  }

  render() {
    return (
      <div>
        <Helmet title="Editor" />
        <CommonHeader />
        <EditorHeader />
        <PageHeader>Header</PageHeader>
        <Form onSubmit={this.onSubmit} />
      </div>
    )
  }
}

EditorPage.defaultProps = {
}

EditorPage.propTypes = {
}

export default connect()(EditorPage)

