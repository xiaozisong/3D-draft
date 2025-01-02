import { Element3D } from "@/engine/interface";
import { Render } from "@/engine/render";
import { Utils } from "@/engine/utils";
import * as THREE from "three";
import { Point } from "../../element/point";
import { Text } from "../../element/text";
import { Icon } from "../../element/icon";
import { isEmpty, set } from "lodash";
import { message } from "antd";

export class DragAction {
  // 是否拖拽中
  isDraging = false;

  // 拖拽物体映射
  dragingObjectsMap: Map<string, Element3D> = new Map();

  // 拖拽物体列表
  dragingObjects: Element3D[] = [];

  // 拖拽物体开始位置映射
  dragStartPositionsMap: Map<string, THREE.Vector3> = new Map();

  // 拖拽物体开始位置列表
  dragStartPositions: Array<THREE.Vector3> = [];

  // 拖拽时点位与物体中心偏移量
  dragDeltaToCenter = new THREE.Vector3();

  // 拖拽偏移量
  dragOffset = new THREE.Vector3();

  constructor (private engine: Render) {

  }

  // 更新拖拽物体映射
  setDragingObjectsMap(key: string, element: Element3D) {
    this.dragingObjectsMap.set(key, element);
    this.dragingObjects = Array.from(this.dragingObjectsMap.values());
  }

  // 更新拖拽物体起始位置映射
  setDragStartPositionsMap(key: string, position: THREE.Vector3) {
    this.dragStartPositionsMap.set(key, position);
    this.dragStartPositions = Array.from(this.dragStartPositionsMap.values());
  }

  // 开始拖拽
  onDragStart(elements: Element3D[], event: MouseEvent) {
    const me = this;
    // 计算点击位置与物体中心偏移量
    var { point: intersectPoint } = me.engine.pickController.pickToPointFromElementOrPlane(event, elements);
    if (intersectPoint) {
      me.dragDeltaToCenter.subVectors(intersectPoint.clone(), elements[0].position.clone());
    }
    me.updateDragStartEffect(elements);
  }

  // 更新拖拽开始效果
  updateDragStartEffect(elements: Element3D[]) {
    const me = this;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      this.setDragingObjectsMap(element.key, element);
      this.setDragStartPositionsMap(element.key, element.position.clone());
    }
    me.isDraging = true;
  }

  // 移动物体
  onDraging(event: MouseEvent) {
    const me = this;
    if (isEmpty(me.dragingObjects)) { return; }
    const { point: intersectPoint, isPlane } = me.engine.pickController.pickToPointFromElementOrPlane(event, me.dragingObjects);
    const noDragable = me.dragingObjects.some(item => !item.dragable);
    if (noDragable) { message.destroy(); message.warning('所选元素不可拖动'); me.onDragEnd(); return; }

    if (!intersectPoint || noDragable) { return; }
    let targetPoint = new THREE.Vector3(
      intersectPoint.x - me.dragDeltaToCenter.x,
      intersectPoint.y - me.dragDeltaToCenter.y,
      intersectPoint.z - me.dragDeltaToCenter.z,
    );
    if (isPlane) {
      targetPoint = Utils.findNearestPoint(targetPoint, this.engine.sceneController.gridPoints);
    }
    this.updateDragingEffect(targetPoint);
  }

  // 更新拖拽作用
  updateDragingEffect(targetPoint: THREE.Vector3) {
    const me = this;
    if (isEmpty(me.dragingObjects)) { return; }

    // 移动鼠标在空间中的位置偏移量
    const newDragOffset = targetPoint.clone().sub(me.dragStartPositions[0].clone());
    this.dragOffset.copy(newDragOffset);
    for (let i = 0; i < me.dragingObjects.length; i++) {
      const element = me.dragingObjects[i];
      const newPosition = me.dragStartPositions[i].clone().add(newDragOffset);
      element.position.copy(newPosition);
      // 文字和图标要稍微上浮一点， 避免渲染争抢
      if (element instanceof Text || element instanceof Icon) {
        element.position.y = newPosition.y + 0.001;
      }

      // 更新关联线
      me.engine.controller.action.line.updateLinkLine(element);
      // 更新关联文字
      me.engine.controller.action.text.updateLinkTextPosition(element);
      // 更新编辑栏位置
      this.engine.controller.setting.updateEditBar();
      // 更新点关联的线
      if (element instanceof Point) {
        me.engine.controller.action.line.updateLineByPoint(element);
      }
      // 更新文字关联的物体的相对位置
      if (element instanceof Text) {
        me.engine.controller.action.text.updateTextRelactionPosition(element);
      }
    }
  }

  // 拖拽结束
  onDragEnd() {
    if (!this.dragingObjects) { return; }
    for (let i = 0; i < this.dragingObjects.length; i++) {
      const dragingObject = this.dragingObjects[i];
      dragingObject.syncPosition();
      this.dragStartPositions[i].set(0, 0, 0);
    }
    this.dragingObjectsMap.clear();
    this.dragStartPositionsMap.clear();
    // 同步物体位置
    this.engine.controller.element.refreshProtoPanel();
    // 重置拖拽参数
    this.dragDeltaToCenter.set(0, 0, 0);
    this.dragOffset.set(0, 0, 0);
    this.dragingObjects = [];
    this.dragStartPositions = [];
    this.isDraging = false;
  }
}