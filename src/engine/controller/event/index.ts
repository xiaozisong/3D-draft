import { LineActionStatus, Element3D } from "@/engine/interface";
import { Render } from "@/engine/render";
import { Line } from "../element/line";
import CommandManager from "@/engine/tools/command/CommandManager";
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
    // 左键单击
    if (event.button === 0) {
      const { element } = me.engine.pickController.pickToPickableElement(event);
      const oldActiveObject = me.engine.controller.action.select.activeElements[0];
      if (!element) {
        // 取消选中
        me.engine.controller.action.select.cancelSelectObject();
        me.engine.controller.action.drag.onDragEnd();
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
        const activeElements = me.engine.controller.action.select.selectObject(element, event);
        me.engine.controller.action.drag.onDragStart(activeElements, event);
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
    if (me.engine.controller.action.drag.isDraging) {
      me.engine.controller.action.drag.onDraging(event);
    }
    // 绘制连线
    if (me.engine.controller.action.line.status === LineActionStatus.create) {
      me.engine.controller.action.line.createLineMouseMove(event);
    }

  }

  // 鼠标松开
  pointerup() {
    const me = this;
    if (me.engine.controller.action.drag.isDraging) {
      const dragStartPositions = me.engine.controller.action.drag.dragStartPositions;
      const dragingObjects = me.engine.controller.action.drag.dragingObjects as Element3D[];
      me.engine.commandManager.executeCommand(new CommandManager.DragCommand(this.engine, { dragStartPositions, dragingObjects }))
    }
  }

  // 绑定事件
  initEvents() {
    const me = this
    const domElement = me.engine.renderer.domElement;
    domElement.addEventListener("pointerdown", this.pointdown.bind(this), false);
    domElement.addEventListener("pointermove", this.pointerMove.bind(this), false);
    domElement.addEventListener("pointerup", this.pointerup.bind(this), false);
  }

  // 主动触发事件
  raiseEvent(type: string) {
    const me = this;
    const domElement = me.engine.renderer.domElement;
    domElement.dispatchEvent(new Event(type));
  }

}