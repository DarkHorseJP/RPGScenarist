import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import ModelBrowser from 'components/ModelBrowser'
import ModelDataForm from './ModelDataForm'

const ModelEditor = () => (
  <Grid style={{ margin: 0 }} fluid>
    <Row>
      <Col xs={6}>
        <ModelBrowser height="100vh - 130px" />
      </Col>
      <Col xs={6}>
        <ModelDataForm height="100vh - 130px" />
      </Col>
    </Row>
  </Grid>
)

export default ModelEditor

