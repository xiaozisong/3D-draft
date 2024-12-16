import { Render } from "@/engine/render";
import { Line } from "../../element/line";
import { LineActionStatus, Element3D } from "@/engine/interface";
import { Utils } from '@/engine/utils';
import * as Three from 'three';

export class LineAction {

  // 当前动作状态
  status: LineActionStatus = LineActionStatus.idle;

  // 临时线
  tempLine: Line;

  // store= new Store()

  // 下一个点位
  nextPoint: Three.Vector3 = new Three.Vector3();

  // 连线目标元素
  targetElement?: Element3D;

  constructor(private engine: Render) {
    this.tempLine = new Line(this.engine, { points: [0, 0, 0] });
    this.tempLine.visible = false;
    this.engine.sceneController.scene.add(this.tempLine);
  };

  // 开始添加箭头
  startAddArrowConnect() {
    this.status = LineActionStatus.add;
    const activeObject = this.engine.controller.event.activeObject;
    if (!activeObject) { return }
    const startPoint = activeObject.position;
    this.tempLine.visible = true;
    this.tempLine.updatePoints([startPoint.x, startPoint.y, startPoint.z])
  };

  // 添加箭头中，鼠标移动点位更新
  addingArrowMouseMove(event: MouseEvent) {
    const me = this;
    const activeObject = this.engine.controller.event.activeObject;
    if (!activeObject) { return }
    const points = this.tempLine.getPoints();
    const length = points.length;
    const prevPoint = length > 3 ? points.slice(0, length - 3) : points;
    const allIntersects = me.engine.pickController?.pick(event);
    const allObjects = allIntersects?.filter((item) => item.object.userData.pickable);

    const intersectPoint = this.engine.pickController.intersectPlane(event);
    this.nextPoint = Utils.findNearestPoint(intersectPoint, this.engine.sceneController.gridPoints);

    if (allObjects.length > 0) {
      const object = allObjects[0].object;
      const target = Utils.lookUpElement(object);
      if (target && !(target instanceof Line)) {
        this.nextPoint = target.position;
        this.targetElement = target;
      }
    }

    const newPoints = [...prevPoint, this.nextPoint.x, this.nextPoint.y, this.nextPoint.z];
    this.tempLine.updatePoints(newPoints);
  };

  // 添加箭头中，鼠标点击点位
  addingArrowPoint(event: MouseEvent) {
    const me = this;
    const activeObject = this.engine.controller.event.activeObject;
    if (!activeObject) {
      return;
    }
    // 获取新点位
    const points = this.tempLine.getPoints();
    const newPoints = [...points, me.nextPoint?.x, me.nextPoint?.y, me.nextPoint?.z];
    // 更新点位
    this.tempLine.updatePoints(newPoints);
    if (this.targetElement) {
      me.endAddArrowConnect();
    }
  }

  // 添加箭头结束
  endAddArrowConnect() {
    const me = this;
    const activeObject = this.engine.controller.event.activeObject;
    if (!activeObject) { return };

    const points = this.tempLine.getPoints();

    // const line = new Line(this.engine, { points: points });
    // 生成线条
    const lineElement = me.engine.controller.element.addElement({
      type: 'line',
      options: {
        points: points.slice(0, points.length - 3),
      }
    });

    //更新线条上的关系
    lineElement.setOptions({
      startElementKey: activeObject.key,
      endElementKey: this.targetElement?.key,
    });

    // 更新当前要素的连接线关系
    const activeObjectOptions = activeObject.getOptions();
    const oldLinkLineKeys = activeObjectOptions.linkLineKeys || [];
    activeObject.setOptions({
      linkLineKeys: [...oldLinkLineKeys, lineElement.key]
    })

    // 更新目标要素的连接线关系
    if (this.targetElement) {
      const targetElementOptions = this.targetElement.getOptions();
      const oldLinkLineKeys = targetElementOptions.linkLineKeys || [];
      this.targetElement.setOptions({
        linkLineKeys: [...oldLinkLineKeys, lineElement.key]
      })
    }

    this.status = LineActionStatus.idle;
    this.tempLine.updatePoints([0, 0, 0]);
    this.tempLine.visible = false;
    this.targetElement = undefined;
    this.nextPoint = new Three.Vector3();
  };

  // 取消当前动作 
  cancelAction() {
    this.status = LineActionStatus.idle;
    this.tempLine.visible = false;
    this.tempLine.updatePoints([0, 0, 0, 0, 0, 0]);
  };

};