import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import SoundBrowser from 'components/SoundBrowser'
import SoundDataForm from './SoundDataForm'

const SoundEditor = () => (
  <Grid style={{ margin: 0 }} fluid>
    <Row>
      <Col xs={6}>
        <SoundBrowser height="100vh - 130px" />
      </Col>
      <Col xs={6}>
        <SoundDataForm height="100vh - 130px" />
      </Col>
    </Row>
  </Grid>
)

export default SoundEditor

