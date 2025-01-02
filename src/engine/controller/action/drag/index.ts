import { Element3D } from "@/engine/interface";
import { Render } from "@/engine/render";
import { Utils } from "@/engine/utils";
import * as THREE from "three";
import { Point } from "../../element/point";
import { Text } from "../../element/text";
import { Icon } from "../../element/icon";

export class DragAction {
  // 是否拖拽中
  isDraging = false;

  // 拖拽物体
  dragingObject?: Element3D;

  // 拖拽时点位与物体中心偏移量
  dragDeltaToCenter = new THREE.Vector3();

  // 拖拽物体开始位置
  dragStartPosition = new THREE.Vector3();

  // 拖拽偏移量
  dragOffset = new THREE.Vector3();

  constructor (private engine: Render) {

  }

  // 开始拖拽
  onDragStart(element: Element3D, event: MouseEvent) {
    const me = this;
    const target = element;
    if (!target) {
      return element;
    }
    // 计算点击位置与物体中心偏移量
    var { point: intersectPoint } = me.engine.pickController.pickToPointFromElementOrPlane(event, [target]);
    if (intersectPoint) {
      me.dragDeltaToCenter.subVectors(intersectPoint.clone(), target.position.clone());
    }
    me.updateDragStartEffect(target);
  }

  // 更新拖拽开始效果
  updateDragStartEffect(target: Element3D) {
    const me = this;
    // 记录拖拽物体
    me.dragingObject = target;
    // 记录拖拽物体起始位置
    me.dragStartPosition.copy(target.position);
    me.isDraging = true;
  }

  // 移动物体
  onDraging(event: MouseEvent) {
    const me = this;
    if (me.dragingObject === undefined) { return; }
    const { point: intersectPoint, isPlane } = me.engine.pickController.pickToPointFromElementOrPlane(event, [me.dragingObject]);
    if (!intersectPoint || !me.dragingObject.dragable) { return; }
    let targetPoint = new THREE.Vector3(
      intersectPoint.x - me.dragDeltaToCenter.x,
      intersectPoint.y - me.dragDeltaToCenter.y,
      intersectPoint.z - me.dragDeltaToCenter.z,
    );
    if (isPlane) {
      targetPoint = Utils.findNearestPoint(targetPoint, this.engine.sceneController.gridPoints);
    }
    // 只有线不允许拖动
    if (!(me.dragingObject instanceof THREE.Line)) {
      this.updateDragingEffect(targetPoint);
    }
  }

  // 更新拖拽作用
  updateDragingEffect(targetPoint: THREE.Vector3) {
    const me = this;
    if (me.dragingObject === undefined) { return; }
    me.dragingObject.position.x = targetPoint.x;
    me.dragingObject.position.z = targetPoint.z;
    if (me.dragingObject instanceof Text || me.dragingObject instanceof Icon) {
      me.dragingObject.position.y = targetPoint.y + 0.001;
    } else {
      me.dragingObject.position.y = targetPoint.y;
    }
    // 平移偏移量
    const newDragOffset = targetPoint.clone().sub(me.dragStartPosition);
    me.dragOffset = newDragOffset;
    // 更新关联线
    me.engine.controller.action.line.updateLinkLine(me.dragingObject);
    // 更新关联文字
    me.engine.controller.action.text.updateLinkTextPosition(me.dragingObject);
    // 更新编辑栏位置
    this.engine.controller.setting.updateEditBar();
    // 更新点关联的线
    if (me.dragingObject instanceof Point) {
      me.engine.controller.action.line.updateLineByPoint(me.dragingObject);
    }
    // 更新文字关联的物体的相对位置
    if (me.dragingObject instanceof Text) {
      me.engine.controller.action.text.updateTextRelactionPosition(me.dragingObject);
    }
  }

  // 拖拽结束
  onDragEnd() {
    // 同步物体位置
    this.dragingObject?.syncPosition();
    this.engine.controller.element.refreshProtoPanel();
    // 重置拖拽参数
    this.dragDeltaToCenter.set(0, 0, 0);
    this.dragStartPosition.set(0, 0, 0);
    this.dragOffset.set(0, 0, 0);
    this.dragingObject = undefined;
    this.isDraging = false;
  }
}