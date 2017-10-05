import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import ImageBrowser from 'components/ImageBrowser'
import ImageDataForm from './ImageDataForm'

const ImageEditor = () => (
  <Grid>
    <Row>
      <Col sm={6}>
        <ImageBrowser />
      </Col>
      <Col sm={6}>
        <ImageDataForm />
      </Col>
    </Row>
  </Grid>
)

export default ImageEditor

