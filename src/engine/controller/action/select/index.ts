import { Element3D } from "@/engine/interface";
import { Render } from "@/engine/render";
import { Utils } from "@/engine/utils";
import * as THREE from "three";
import { Point } from "../../element/point";
import { Text } from "../../element/text";

export class SelectAction {
  // 当前选中的物体
  _activeElement?: Element3D;

  // 拖拽时点位与物体中心点的偏移量
  dragDeltaToCenter = new THREE.Vector3();

  // 拖拽物体
  dragObject?: Element3D;

  constructor (private engine: Render) {

  }

  set activeElement(value) {
    this._activeElement = value;
    let activeElementKeys = [];
    if (value) {
      activeElementKeys.push(value.key);
    } else {
      activeElementKeys = []
    }

    this.engine.controller.setting.store.setState({
      activeElementKeys,
    })
    this.engine.controller.setting.updateEditBar();
  }

  get activeElement() {
    return this._activeElement;
  }

  // 选中物体
  selectObject(element: Element3D, event: MouseEvent) {
    const me = this;
    const target = element;
    console.log({
      target1: target
    })
    if (!target) {
      return element;
    }

    var inersectPoint = me.engine.pickController.intersectPlane(event);
    if (inersectPoint) {
      me.dragDeltaToCenter.subVectors(inersectPoint, target.position);
    }
    me.dragObject = target;
    me.activeElement?.disActive();
    me.activeElement = target;
    me.activeElement?.active();
    return element;
  }

  // 取消选中物体
  cancelSelectObject() {
    this.activeElement?.disActive();
    this.dragObject = undefined;
    this.activeElement = undefined;
  }

  // 移动物体
  moveObject(event: MouseEvent) {
    const me = this;
    if (me.dragObject === undefined) { return; }
    var { point: intersectPoint, isPlane } = me.engine.pickController.pickToPointFromElementOrPlane(event, [me.dragObject]);
    // var intersectPoint = me.engine.pickController.intersectPlane(event);
    if (!intersectPoint || !me.dragObject?.dragable) { return }
    // const tempVector = new THREE.Vector3(intersectPoint.x - me.dragDeltaToCenter.x, 0, intersectPoint.z - me.dragDeltaToCenter.z);
    // const targetPoint = Utils.findNearestPoint(tempVector, this.engine.sceneController.gridPoints);
    let targetPoint = new THREE.Vector3(
      intersectPoint.x - me.dragDeltaToCenter.x,
      intersectPoint.y - me.dragDeltaToCenter.y,
      intersectPoint.z - me.dragDeltaToCenter.z
    );
    if (isPlane) {
      targetPoint = Utils.findNearestPoint(targetPoint, this.engine.sceneController.gridPoints);
    }
    if (!(me.dragObject instanceof THREE.Line)) {
      me.dragObject.position.x = targetPoint.x;
      me.dragObject.position.z = targetPoint.z;
      me.dragObject.position.y = targetPoint.y + 0.005;
      // 更新关联线
      me.engine.controller.action.line.updateLinkLine(me.dragObject);
      // 更新关联文字
      me.engine.controller.action.text.updateLinkTextPosition(me.dragObject);
      // 更新编辑栏位置
      this.engine.controller.setting.updateEditBar();
      // 更新点关联的线
      if (me.dragObject instanceof Point) {
        me.engine.controller.action.line.updateLineByPoint(me.dragObject);
      }
      // 更新文字关联的物体的相对位置
      if (me.dragObject instanceof Text) {
        me.engine.controller.action.text.updateTextRelactionPosition(me.dragObject);
      }
    }
  }
}