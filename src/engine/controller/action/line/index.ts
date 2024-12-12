import { Render } from "@/engine/render";
import { Line } from "../../element/line";
import { LineActionStatus } from "@/engine/interface";

export class LineAction {

  status: LineActionStatus = LineActionStatus.idle;

  tempLine: Line;

  // store= new Store()

  constructor(private engine: Render) {
    this.tempLine = new Line(this.engine, { points: [0, 0, 0, 0, 0, 0] });
    // this.tempLine.visible = false;
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
  addingArrowPositionUpdate(event: MouseEvent) {
    const activeObject = this.engine.controller.event.activeObject;
    if (!activeObject) { return }
    const points = this.tempLine.getPoints();
    const length = points.length;
    const prevPoint = length > 3 ? [points[length - 6], points[length - 5], points[length - 4]] : [points[length - 3], points[length - 2], points[length - 1]]
    const nextPoint = this.engine.pickController.intersectPlane(event)
    const newPoints = [...prevPoint, nextPoint.x, nextPoint.y, nextPoint.z]
    this.tempLine.updatePoints(newPoints);
  };

  // 添加箭头结束
  endAddArrowConnect() {
    const me = this;
    const activeObject = this.engine.controller.event.activeObject;
    if (!activeObject) { return };

    const points = this.tempLine.getPoints();

    // const line = new Line(this.engine, { points: points });

    me.engine.controller.element.addElement({ type: 'line', options: { points } });

    this.status = LineActionStatus.idle;
    this.tempLine.visible = false;
  };

  // 取消当前动作 
  cancelAction() {
    this.status = LineActionStatus.idle;
    this.tempLine.visible = false;
    this.tempLine.updatePoints([0, 0, 0, 0, 0, 0]);
  };

};