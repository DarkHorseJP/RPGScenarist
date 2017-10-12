import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import ImageBrowser from 'components/ImageBrowser'
import ImageDataForm from './ImageDataForm'

const ImageEditor = () => (
  <Grid style={{ margin: 0 }} fluid>
    <Row>
      <Col xs={6}>
        <ImageBrowser height="100vh - 130px" />
      </Col>
      <Col xs={6}>
        <ImageDataForm height="100vh - 130px" />
      </Col>
    </Row>
  </Grid>
)

export default ImageEditor

