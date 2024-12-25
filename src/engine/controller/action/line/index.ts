import { Render } from "@/engine/render";
import { Line } from "../../element/line";
import { LineActionStatus, Element3D } from "@/engine/interface";
import { Utils } from '@/engine/utils';
import * as THREE from 'three';
import { isEmpty } from "lodash";
import { Point } from "../../element/point";
import { Area } from "../../element/area";

export class LineAction {

  // 当前动作状态
  _status: LineActionStatus = LineActionStatus.idle;

  // 临时线
  tempLine: Line;

  // store= new Store()

  // 下一个点位
  nextPoint: THREE.Vector3 = new THREE.Vector3();

  // 连线原始元素
  originElement?: Element3D;

  // 连线目标元素
  targetElement?: Element3D;

  constructor(private engine: Render) {
    this.tempLine = new Line(this.engine, { points: [0, 0, 0] });
    this.tempLine.visible = false;
    this.tempLine.pickable = false;
    this.engine.sceneController.scene.add(this.tempLine);
  };

  set status(status: LineActionStatus) {
    this._status = status;
    switch (status) {
      case LineActionStatus.create:
        break;
      case LineActionStatus.addPoint:
        break;
      case LineActionStatus.idle:
        break;
      default:
        break;
    }
  }

  get status() {
    return this._status;
  }

  // 判断是否可连接
  canLink(target: Element3D): boolean {
    if (target instanceof Line) {
      return false;
    }
    if (target instanceof Point) {
      return false;
    }
    if (target instanceof Area) {
      return false;
    }
    return true;
  }

  // 开始添加箭头
  startCreateLine(showArrow: boolean) {
    const me = this;
    me.reset();
    this.status = LineActionStatus.create;
    const activeElement = this.engine.controller.action.select.activeElement;
    if (!activeElement) { return }
    this.originElement = activeElement;
    const startPoint = this.originElement.position;
    this.tempLine.visible = true;
    this.tempLine.setOptions({
      showArrow
    })
    this.tempLine.setArrowVisible(showArrow);
    this.tempLine.updatePoints([startPoint.x, startPoint.y, startPoint.z])
  };

  // 添加箭头中，鼠标移动点位更新
  createLineMouseMove(event: MouseEvent) {
    const me = this;
    const points = this.tempLine.getPoints();
    const length = points.length;
    const prevPoint = length > 3 ? points.slice(0, length - 3) : points;

    const intersectPoint = this.engine.pickController.intersectPlane(event);
    this.targetElement = undefined;
    this.nextPoint = Utils.findNearestPoint(intersectPoint, this.engine.sceneController.gridPoints);

    const { element } = me.engine.pickController.pickToElement(event);
    if (element && !me.canLink(element)) {
      this.nextPoint = element.position;
      this.targetElement = element
    }

    const newPoints = [...prevPoint, this.nextPoint.x, this.nextPoint.y, this.nextPoint.z];
    this.tempLine.updatePoints(newPoints);
  };

  // 添加箭头中，鼠标点击点位
  addingLinePoint() {
    const me = this;
    // 获取新点位
    const points = this.tempLine.getPoints();
    const newPoints = [...points, me.nextPoint?.x, me.nextPoint?.y, me.nextPoint?.z];
    // 更新点位
    this.tempLine.updateGeometryPoint(newPoints);
    this.tempLine.updateBreakPoints();
    if (this.targetElement) {
      me.endCreateLine();
    }
  }

  // 添加箭头结束
  endCreateLine() {
    const me = this;
    const originElement = me.originElement;
    if (!originElement) { return }
    const { points, showArrow } = this.tempLine.getOptions();
    if (points.length <= 3) {
      me.reset();
      return;
    }

    // const line = new Line(this.engine, { points: points });
    // 生成线条
    const lineElement = me.engine.controller.element.addElement({
      type: 'line',
      options: {
        name: '折线',
        points: points.slice(0, points.length - 3),
        startElementKey: originElement.key,
        endElementKey: this.targetElement?.key,
        showArrow,
      }
    });

    //更新线条上的关系
    // lineElement.setOptions({
    //   startElementKey: originElement?.key,
    //   endElementKey: this.targetElement?.key,
    // });

    // 更新当前要素的连接线关系
    const originElementOptions = originElement?.getOptions();
    const oldLinkLineKeys = originElementOptions?.linkLineKeys || [];
    originElement?.setOptions({
      linkLineKeys: [...oldLinkLineKeys, lineElement.key]
    })

    // 更新目标要素的连接线关系
    if (this.targetElement) {
      const targetElementOptions = this.targetElement.getOptions();
      const oldLinkLineKeys = targetElementOptions.linkLineKeys || [];
      this.targetElement.setOptions({
        linkLineKeys: [...oldLinkLineKeys, lineElement.key]
      });
    }
    
    me.engine.controller.element.refreshElementList();
    me.reset();
  };

  reset() {
    this.status = LineActionStatus.idle;
    this.tempLine.updatePoints([0, 0, 0]);
    this.tempLine.visible = false;
    this.originElement = undefined;
    this.targetElement = undefined;
    this.nextPoint = new THREE.Vector3();
  }

  // 取消当前动作 
  cancelAction() {
    this.status = LineActionStatus.idle;
    this.tempLine.visible = false;
    this.tempLine.updatePoints([0, 0, 0, 0, 0, 0]);
  };

  // 移动物体时更新该物体的关联线
  updateLinkLine(obejct: Element3D) {
    const linkLineKeys = obejct.getOptions().linkLineKeys || [];
    if (isEmpty(linkLineKeys)) { return }

    const linkLines = linkLineKeys.map(key => this.engine.controller.element.getElementByKey(key));

    linkLines.forEach(line => {
      if (line && line instanceof Line) {
        line.updatePointsByRelation();
      }
    })
  }

  removeLineLink(target: Line) {
    const startElementKey = target.getOptions().startElementKey;
    const endElementKey = target.getOptions().endElementKey;

    if (startElementKey) {
      const startElement = this.engine.controller.element.getElementByKey(startElementKey);
      startElement?.setOptions({
        linkLineKeys: startElement.getOptions().linkLineKeys?.filter(key => key !== target.key)
      });
    }

    if (endElementKey) {
      const endElement = this.engine.controller.element.getElementByKey(endElementKey);
      endElement?.setOptions({
        linkLineKeys: endElement.getOptions().linkLineKeys?.filter(key => key !== target.key)
      });
    }

    target.setOptions({
      startElementKey: undefined,
      endElementKey: undefined,
    })
  }

  // 根据点要素更新线条的数据
  updateLineByPoint(target: Point) {
    const point = target.position;
    const { lineKey, index } = target.getOptions();
    if (lineKey && index !== undefined) {
      const line = this.engine.controller.element.getElementByKey(lineKey);
      if (line && line instanceof Line) {
        const points = line.getPoints();
        points.splice(index * 3, 3, point.x, point.y, point.z);
        line.updateGeometryPoint(points);
        line.updateArrow();
      }
    }
  }

  // 新增线条上的点
  addPoint(event: MouseEvent) {
    const me = this;
    const activeElement = this.engine.controller.action.select.activeElement;
    if (!activeElement || !(activeElement instanceof Line) || me.status !== LineActionStatus.addPoint) {
      return;
    }
    const intersectPoint = this.engine.pickController.pickToPoint(event, activeElement);
    if (intersectPoint) {
      const positions = activeElement.getPoints();
      let closestSegmentIndex = 0;
      let closestDistance = Infinity;
      // 遍历每段线段，找到距离点击最近的线段
      for (let i = 0; i < positions.length - 3; i += 3) {
        const start = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        const end = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
        const distance = Utils.Math.distanceToSegment(intersectPoint, start, end);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSegmentIndex = i / 3;
        }
      }

      const newPositions = [];
      for (let i = 0; i < positions.length; i += 3) {
        newPositions.push(positions[i], positions[i + 1], positions[i + 2]);
        if (i == closestSegmentIndex * 3) {
          newPositions.push(intersectPoint.x, intersectPoint.y, intersectPoint.z);
        }
      }
      activeElement.updatePoints(newPositions);
      const activeBreakPoint = activeElement.getBreakPoint(closestSegmentIndex + 1);
      this.engine.controller.action.select.selectObject(activeBreakPoint, event);
    }
    this.reset();
  }

  // 删除线条上的点
  removeLinePoint(target: Point) {
    const { lineKey, index } = target.getOptions();
    if (!lineKey || index === undefined) {
      return;
    }
    const line = this.engine.controller.element.getElementByKey(lineKey);
    if (line && line instanceof Line) {
      const points = line.getPoints();
      points.splice(index * 3, 3);
      line.updatePoints(points);
    }
  }

};