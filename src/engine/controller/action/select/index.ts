import { Element3D } from "@/engine/interface";
import { Render } from "@/engine/render";
import { Utils } from "@/engine/utils";
import * as THREE from "three";
import { Point } from "../../element/point";

export class SelectAction {
  // 当前选中的物体
  _activeObject?: Element3D;

  // 拖拽偏移量
  dragDelta = new THREE.Vector3();

  // 拖拽物体
  dragObject?: Element3D;

  constructor (private engine: Render) {

  }

  set activeObject(value) {
    this._activeObject = value;
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

  get activeObject() {
    return this._activeObject;
  }

  // 选中物体
  selectObject(element: Element3D, event: MouseEvent) {
    const me = this;
    const target = element;
    if (!target) {
      return element;
    }

    var inersectPoint = me.engine.pickController.intersectPlane(event);
    if (inersectPoint) {
      me.dragDelta.subVectors(inersectPoint, target.position);
    }
    me.dragObject = target;
    me.activeObject?.disActive();
    me.activeObject = target;
    me.activeObject?.active();
    return element;
  }

  // 取消选中物体
  cancelSelectObject() {
    this.activeObject?.disActive();
    this.dragObject = undefined;
    this.activeObject = undefined;
  }

  // 移动物体
  moveObject(event: MouseEvent) {
    const me = this;
    var intersectPoint = me.engine.pickController.intersectPlane(event);
    if (!intersectPoint || !me.dragObject?.dragable) { return }
    const tempVector = new THREE.Vector3(intersectPoint.x - me.dragDelta.x, 0, intersectPoint.z - me.dragDelta.z);
    const targetPoint = Utils.findNearestPoint(tempVector, this.engine.sceneController.gridPoints);
    if (!(me.dragObject instanceof THREE.Line)) {
      me.dragObject.position.x = targetPoint.x;
      me.dragObject.position.z = targetPoint.z;
      // 更新关联线
      me.engine.controller.action.line.updateLinkLine(me.dragObject);
      // 更新编辑栏位置
      this.engine.controller.setting.updateEditBar();
      if (me.dragObject instanceof Point) {
        me.engine.controller.action.line.updateLineByPoint(me.dragObject);
      }
    }
  }
}