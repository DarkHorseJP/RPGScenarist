import React from 'react'
import PropTypes from 'prop-types'
// import styles from '../script/styles'

import {
  SCNScene,
  SCNNode,
  SCNLight,
  SCNVector3,
  SCNVector4,
  SKColor,
  CGPoint
} from 'jscenekit'
import {
  MMDCameraNode,
  MMDSceneSource,
  MMDIKController
} from 'jmmdscenekit'

import ModelView from './ModelView'

/* eslint no-underscore-dangle: 0 */
export default class SCNViewer extends React.Component {
  constructor(props) {
    super(props)

    this.node = null

    this.state = {
      view: new ModelView(),
      pipe: Promise.resolve(),
      cameraNode: null,
      modelObj: null,
      motionObj: null,
      lastMousePosition: new CGPoint(0, 0),
      lastRotX: 0,
      lastRotY: 0
    }
  }

  componentDidMount() {
    console.log('SCNView componentDidMount')

    // this.state.view.appendTo(ReactDOM.findDOMNode(this))
    console.log(`this.node: ${this.node}`)
    this.state.view.appendTo(this.node)
    this._setupView()

    if (this.props.model !== null) {
      this._updateModel(this.props.model)
    }
    if (this.props.motion !== null) {
      this._updateMotion(this.props.motion)
    }
    if (this.props.model !== null && this.props.motion !== null) {
      this._setMotion()
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(`componentWillReceiveProps:${nextProps}`)
    if (this.props.model !== nextProps.model) {
      console.log(`model: ${nextProps.model}`)
      this._updateModel(nextProps.model)
    }
    if (this.props.motion !== nextProps.motion) {
      this._updateMotion(nextProps.motion)
    }
    if (this.props.model !== nextProps.model || this.props.motion !== nextProps.motion) {
      if (this.props.motion !== null) {
        this._setMotion()
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    // do something if needed
    return false
  }

  componentWillUnmount() {
    if (this.state.view) {
      this.state.view.stop()
    }
  }


  _setupView() {
    const view = this.state.view
    view.showLoading()
    view.play()

    // create a new scene
    const scene = new SCNScene()

    // create and add a camera to the scene
    this.state.cameraNode = new MMDCameraNode()
    this.state.cameraNode.distance = 50.0
    scene.rootNode.addChildNode(this.state.cameraNode)

    this._updateCameraPosition()

    // create and add a light to the scene
    const lightNode = new SCNNode()
    lightNode.light = new SCNLight()
    lightNode.light.type = SCNLight.LightType.directional
    lightNode.light.castsShadow = true
    lightNode.position = new SCNVector3(0, 100, 0)
    lightNode.rotation = new SCNVector4(1, 0, 0, Math.PI * 0.5)
    scene.rootNode.addChildNode(lightNode)

    // create and add an ambient light to the scene
    const ambientLightNode = new SCNNode()
    ambientLightNode.light = new SCNLight()
    ambientLightNode.light.type = SCNLight.LightType.ambient
    ambientLightNode.light.color = SKColor.darkGray
    scene.rootNode.addChildNode(ambientLightNode)

    // set the scene to the view
    view.scene = scene

    // allows the user to the manipulate the camera
    view.allowsCameraControl = false

    // show statistics such as fps and timing information
    view.showsStatistics = false

    // configure the view
    view.backgroundColor = SKColor.white

    view.delegate = MMDIKController.sharedController
    view.eventsDelegate = this
  }

  _updateModel(modelPath) {
    console.log(`modelPath: ${modelPath}`)
    this.state.view.showLoading()
    this.state.pipe = this.state.pipe.then(() => {
      const source = MMDSceneSource.sceneSourceWithURLOptions(modelPath)
      return source.didLoad.then(() => {
        console.log('then source')
        const model = source.getModel()
        if (model) {
          const scale = this.props.scale
          console.log(`scale: ${scale}`)
          model.scale = new SCNVector3(scale, scale, scale)
          if (this.state.modelObj) {
            this.state.modelObj.removeFromParentNode()
          }
          this.state.view.scene.rootNode.addChildNode(model)
          this.state.modelObj = model
          this._updateCameraPosition()
          if (this.props.onModelChanged) {
            this.props.onModelChanged(this.state.modelObj)
          }
        }
        this.state.view.hideLoading()
      })
        .catch((error) => {
          if (this.props.onError) {
            this.props.onError(error)
          }
        })
    })
  }

  _updateMotion(motionPath) {
    this.state.pipe = this.state.pipe.then(() => {
      const source = MMDSceneSource.sceneSourceWithURLOptions(motionPath)
      return source.didLoad.then(() => {
        const motion = source.getMotion()
        if (motion) {
          motion.repeatCount = Infinity
          this.state.motionObj = motion
          if (this.props.onMotionChanged) {
            this.props.onMotionChanged(this.state.motionObj)
          }
        }
      })
        .catch((error) => {
          if (this.props.onError) {
            this.props.onError(error)
          }
        })
    })
  }

  _setMotion() {
    this.state.pipe = this.state.pipe.then(() => {
      this.state.modelObj.addAnimationForKey(this.state.motionObj, 'motion')
    })
  }

  _updateCameraPosition() {
    if (!this.state.modelObj) {
      this.state.cameraNode.position = new SCNVector3(0, 0, 0)
      return
    }

    const modelBB = this.state.modelObj.boundingBox
    const x = (modelBB.min.x + modelBB.max.x) * 0.5
    const y = (modelBB.min.y + modelBB.max.y) * 0.5
    const z = (modelBB.min.z + modelBB.max.z) * 0.5
    this.state.cameraNode.position = new SCNVector3(x, y, z)
    this.state.cameraNode.rotX = 0
    this.state.cameraNode.rotY = 0
    this.state.cameraNode.distance = 40.0

    // TODO: update distance
  }

  mouseDownWith(event) {
    this.state.lastMousePosition = this.state.view.convertFrom(event.locationInWindow)
    this.state.lastRotX = this.state.cameraNode.rotX
    this.state.lastRotY = this.state.cameraNode.rotY

    return true
  }

  mouseDraggedWith(event) {
    const mousePosition = this.state.view.convertFrom(event.locationInWindow)
    this.panCamera(mousePosition.sub(this.state.lastMousePosition))

    return true
  }

  mouseUpWith(event) { // eslint-disable-line no-unused-vars
    return true
  }

  scrollWheelWith(event) {
    const scrollSpeed = 0.01
    const dz = -event.deltaY * scrollSpeed
    let distance = this.state.cameraNode.distance + dz
    distance = Math.min(80.0, Math.max(10.0, distance))
    this.state.cameraNode.distance = distance
    return true
  }

  panCamera(direction) {
    const rotateSpeed = 0.01
    const rotDx = -direction.y * rotateSpeed
    const rotDy = -direction.x * rotateSpeed
    const rotX = this.state.lastRotX + rotDx
    const rotY = this.state.lastRotY + rotDy
    // rotX = Math.max(-Math.PI / 2, Math.min(0.1, rotX))

    this.state.cameraNode.rotX = rotX
    this.state.cameraNode.rotY = rotY
  }

  render() {
    return (
      <div ref={(node) => { this.node = node }} />
    )
  }
}

SCNViewer.defaultProps = {
  model: null,
  motion: null,
  scale: 1.0,
  onModelChanged: null,
  onMotionChanged: null,
  onError: null
}

SCNViewer.propTypes = {
  model: PropTypes.string,
  motion: PropTypes.string,
  scale: PropTypes.number,
  onModelChanged: PropTypes.func,
  onMotionChanged: PropTypes.func,
  onError: PropTypes.func
}

