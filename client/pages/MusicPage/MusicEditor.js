import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import MusicBrowser from 'components/MusicBrowser'
import MusicDataForm from './MusicDataForm'

const MusicEditor = () => (
  <Grid style={{ margin: 0 }} fluid>
    <Row>
      <Col xs={6}>
        <MusicBrowser height="100vh - 130px" />
      </Col>
      <Col xs={6}>
        <MusicDataForm height="100vh - 130px" />
      </Col>
    </Row>
  </Grid>
)

export default MusicEditor

