import {
  CGPoint,
  SCNView,
  SKAction,
  SKColor,
  SKLabelHorizontalAlignmentMode,
  SKLabelNode,
  SKScene,
  SKSceneScaleMode
} from 'jscenekit'

/* eslint no-underscore-dangle: 0 */
const _loadingText = 'Loading...'

export default class ModelView extends SCNView {
  constructor(frame, options = null) {
    super(frame, options)

    this._loadingScene = null

    this._loadingBackground = null

    this._loadingLabel = null

    this.eventsDelegate = null

    this._setupLoadingScene()
  }

  _setupLoadingScene() {
    this._loadingScene = new SKScene()
    this._loadingScene.scaleMode = SKSceneScaleMode.resizeFill

    this._loadingLabel = new SKLabelNode()
    this._loadingLabel.text = _loadingText
    this._loadingLabel.fontColor = SKColor.black
    this._loadingLabel.horizontalAlignmentMode = SKLabelHorizontalAlignmentMode.left
    this._loadingLabel.position = new CGPoint(20, 20)

    const fadeAction = SKAction.repeatForever(
      SKAction.sequence([
        SKAction.fadeOutWithDuration(0.5),
        SKAction.fadeInWithDuration(0.5)
      ])
    )
    this._loadingLabel.run(fadeAction)

    this._loadingScene.addChild(this._loadingLabel)
  }

  mouseDownWith(event) {
    if (!this.eventsDelegate
      || !this.eventsDelegate.mouseDownWith
      || !this.eventsDelegate.mouseDownWith(event)) {
      super.mouseDownWith(event)
    }
  }

  mouseDraggedWith(event) {
    if (!this.eventsDelegate
      || !this.eventsDelegate.mouseDraggedWith
      || !this.eventsDelegate.mouseDraggedWith(event)) {
      super.mouseDraggedWith(event)
    }
  }

  mouseUpWith(event) {
    if (!this.eventsDelegate
      || !this.eventsDelegate.mouseUpWith
      || !this.eventsDelegate.mouseUpWith(event)) {
      super.mouseUpWith(event)
    }
  }

  scrollWheelWith(event) {
    if (!this.eventsDelegate
      || !this.eventsDelegate.scrollWheelWith
      || !this.eventsDelegate.scrollWheelWith(event)) {
      super.mouseScrollWith(event)
    }
  }

  showLoading(text = _loadingText) {
    this._loadingLabel.text = text
    this.overlaySKScene = this._loadingScene
  }

  hideLoading() {
    this.overlaySKScene = null
  }
}

