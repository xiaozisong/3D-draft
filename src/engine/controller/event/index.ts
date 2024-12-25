import { LineActionStatus } from "@/engine/interface";
import { Render } from "@/engine/render";
import { Line } from "../element/line";
import * as THREE from "three";

export class Events {

  constructor(private engine: Render) {
    this.initEvents();
  }

  // 鼠标按下
  pointdown(event: MouseEvent) {
    const me = this;
    event.preventDefault();
    const camera = me.engine.cameraController.camera;
    if (camera instanceof THREE.PerspectiveCamera) {
      return;
    }
    if (event.button === 0) {
      const { element, point } = me.engine.pickController.pickToPickableElement(event);
      const oldActiveObject = me.engine.controller.action.select.activeElement;
      if (!element) {
        // 取消选中
        me.engine.controller.action.select.cancelSelectObject();
      } else {
        // 如果已经是新增点模式，则开始新增点
        if (element && element instanceof Line && oldActiveObject && me.engine.controller.action.line.status === LineActionStatus.addPoint) {
          me.engine.controller.action.line.addPoint(event);
          return;
        }
        // } else {
        //   me.engine.controller.action.line.status = LineActionStatus.idle;
        // }
        // 选中
        me.engine.controller.action.select.selectObject(element, event);
      }
      // 如果选中的是线条，则进入线条的新增点模式
      if (element && element instanceof Line) {
        me.engine.controller.action.line.status = LineActionStatus.addPoint;
        return;
      }
      // 绘制连线
      if (me.engine.controller.action.line.status === LineActionStatus.create) {
        me.engine.controller.action.line.addingLinePoint();
        return;
      }
    }
  }

  // 鼠标移动
  pointerMove(event: MouseEvent) {
    const me = this;
    // 拖拽物体
    if (me.engine.controller.action.select.dragObject) {
      me.engine.controller.action.select.moveObject(event);
    }
    // 绘制连线
    if (me.engine.controller.action.line.status === LineActionStatus.create) {
      me.engine.controller.action.line.createLineMouseMove(event);
    }

  }

  // 鼠标松开
  pointerup() {
    const me = this;
    me.engine.controller.action.select.dragObject = undefined;
  }

  // 绑定事件
  initEvents() {
    const me = this
    const domElement = me.engine.renderer.domElement;
    domElement.addEventListener("pointerdown", this.pointdown.bind(this), false);
    domElement.addEventListener("pointermove", this.pointerMove.bind(this), false);
    domElement.addEventListener("pointerup", this.pointerup.bind(this), false);
  }

}