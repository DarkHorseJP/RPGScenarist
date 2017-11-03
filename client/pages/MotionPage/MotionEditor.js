import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import MotionBrowser from 'components/MotionBrowser'
import MotionDataForm from './MotionDataForm'

const MotionEditor = () => (
  <Grid style={{ margin: 0 }} fluid>
    <Row>
      <Col xs={6}>
        <MotionBrowser height="100vh - 130px" />
      </Col>
      <Col xs={6}>
        <MotionDataForm height="100vh - 130px" />
      </Col>
    </Row>
  </Grid>
)

export default MotionEditor

