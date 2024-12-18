import { SIDE_DARK_COLOR, SIDE_LIGHT_COLOR, TOP_COLOR } from "@/engine/constant";
import { Render } from "@/engine/render";
import * as THREE from "three";
import { Line2, LineGeometry, LineMaterial } from "three/addons";
import { Base3DObject } from "../base";
import { Utils } from "@/engine/utils";
import { BaseOptions } from "@/engine/interface";
import { Point } from "../point";

export interface LineOptions extends BaseOptions {
  points: number[],
  startElementKey?: string,
  endElementKey?: string,
  color?: string,
  opacity?: number,
  lineWidth?: number,
  showArrow?: boolean,
}


export class Line extends Base3DObject<LineOptions> {
  name: string = '线';
  // 是否可拖拽
  dragable: boolean = false;
  lineWdith = 0.03;
  lineWdithActive = 0.03;

  // 线条实例
  line?: Line2;

  // 材质配置
  matLineOptions = {
    color: this.defaultOutlineColor,
    linewidth: this.lineWdith,
    worldUnits: true,
    dashed: false,
    alphaToCoverage: true,
    vertexColors: false,
  }
  // 材质
  matLine?: LineMaterial = new LineMaterial(this.matLineOptions);

  // 顶点集合
  pointsGroup?: THREE.Group<THREE.Object3DEventMap>;

  // 箭头
  arrow?: THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;

  constructor(engine: Render, options: LineOptions) {
    super(engine, options);
    this.init();
  }

  init() {
    const me = this;
    const lineGeometry = new LineGeometry();

    lineGeometry.setPositions(this.options.points);

    const line = new Line2(lineGeometry, me.matLine);
    line.computeLineDistances();
    line.scale.set(1, 1, 1);

    this.line = line;
    me.add(line);
    me.updateBreakPoints();
    me.updateArrow();
  }

  // 获取点位信息
  getPoints() {
    return this.options.points
  }
  
  // 获取起点位置
  getStartPoints() {
    return [this.options.points[0], this.options.points[1], this.options.points[2]]
  }

  // 获取中间位置(少于2个点的返回空数组)
  getMiddlePoints() {
    const points = this.getPoints();
    if (points.length <= 6) {
      return [];
    } else {
      return points.slice(3, points.length - 3);
    }
  }

  // 获取终点位置
  getEndPoints() {
    const length = this.options.points.length
    return [this.options.points[length - 3], this.options.points[length - 2], this.options.points[length - 1]]
  }

  // 更新几何点信息
  updateGeometryPoint(points: number[]) {
    const oldGeometry = this.line?.geometry as LineGeometry;
    if (!this.line || !oldGeometry) { return; }
    const newGeometry = new LineGeometry();
    newGeometry?.setPositions(points);
    newGeometry.attributes.position.needsUpdate = true;
    this.line?.computeLineDistances();
    this.line.geometry = newGeometry;
    this.options.points = points;
    oldGeometry.dispose();
  }

  // 更新几何点信息以及折点
  updatePoints(points: number[]) {
    this.updateGeometryPoint(points);
    this.updateBreakPoints();
    this.updateArrow();
  }

  // 更新箭头
  updateArrow() {
    const me = this;
    if (me.options.showArrow === false) { return }
    const points = me.getPoints();
    const length = points.length;

    // 没有arrow就创建
    if (!me.arrow) {
      // 创建箭头的形状
      const shape = new THREE.Shape();
      const scale = 0.15;
      shape.moveTo(0, 0);
      shape.lineTo(-1 * scale, -2 * scale);
      shape.lineTo(0, -1.5 * scale);
      shape.lineTo(1 * scale, -2 * scale);
      shape.lineTo(0, 0);
      // 使用ExtrudeGeometry 创建平面箭头
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0,
        bevelEnabled: false,
      });
      // 创建材质
      const material = new THREE.MeshBasicMaterial({ color: this.defaultOutlineColor, side: THREE.DoubleSide });
      // 创建Mesh
      const arrow = new THREE.Mesh(geometry, material);
      arrow.rotation.x = -Math.PI / 2;
      this.arrow = arrow;
      me.add(arrow);
    }
    if (this.arrow) {
      let arrowStartPoint = new THREE.Vector3(...me.getStartPoints());
      if (length >= 6) {
        arrowStartPoint = new THREE.Vector3(points[length - 6], points[length - 5], points[length - 4]);
      }
      let endPoint = new THREE.Vector3(points[length - 3], points[length - 2], points[length - 1]);
      // 如果链接的元素存在，则更新剪头的位置
      if (me.options.endElementKey) {

        const endElement = me.engine.controller.element.getElementByKey(me.options.endElementKey);
        if (endElement) {
          const endElementIntersectPoint = Utils.getIntersectPointBySegment({
            startPoint: arrowStartPoint,
            endPoint,
            target: endElement,
          });
          if (endElementIntersectPoint) {
            endPoint = endElementIntersectPoint;
          }
        }
      }
      const direction = new THREE.Vector3().subVectors(arrowStartPoint, endPoint).normalize();
      // 设置箭头的位置到线段的末尾
      this.arrow.position.copy(endPoint);
      // 计算箭头的旋转角度
      const angle = Math.atan2(direction.x, direction.z);
      this.arrow.rotation.z = angle;
    }
  }

  // 设置箭头是否可见
  setArrowVisible(visible: boolean) {
    if (this.arrow) {
      this.arrow.visible = visible;
    }
  }

  // 更新折点
  updateBreakPoints() {
    const me = this;
    if (this.pointsGroup) {
      Utils.disposeGroup(this.pointsGroup);
    }
    const pointsGroup = new THREE.Group();
    const points = me.options.points;

    for (let i = 0; i < points.length; i += 3) {
      const x = points[i];
      const y = points[i + 1];
      const z = points[i + 2];
      const point = new Point(this.engine, {
        x,y,z,
        index: Math.floor(i / 3),
        lineKey: me.key,
      })
      pointsGroup.add(point)
    }

    this.pointsGroup = pointsGroup;
    me.add(pointsGroup)
  }

  // 根据要素关系更新线条
  updatePointsByRelation() {
    const me = this;
    const startElementKey = me.options.startElementKey;
    const endElementKey = me.options.endElementKey;

    let startPoint = this.getStartPoints();
    let endPoint = this.getEndPoints();
    if (startElementKey) {
      const startElement = me.engine.controller.element.getElementByKey(startElementKey);
      if (startElement) {
        startPoint = [startElement.position.x, startElement.position.y, startElement.position.z];
      }
    }
    if (endElementKey) {
      const endElement = me.engine.controller.element.getElementByKey(endElementKey);
      if (endElement) {
        endPoint = [endElement.position.x, endElement.position.y, endElement.position.z];
      }
    }

    const middlePoints = this.getMiddlePoints();
    me.updatePoints([...startPoint, ...middlePoints, ...endPoint]);
  }

  // 通过索引获取折点
  getBreakPoint(index: number) {
    return this.pointsGroup?.children[index] as Point;
  }

  active() {
    if (this.matLine) {
      this.matLine.linewidth = this.lineWdithActive
      this.matLine.color.set(this.activeOutlineColor)
    }
    if (this.arrow) {
      this.arrow.material.color.set(this.activeOutlineColor);
    }
  }

  disActive() {
    if (this.matLine) {
      this.matLine.linewidth = this.lineWdith;
      this.matLine.color.set(this.defaultOutlineColor)
    }
    if (this.arrow) {
      this.arrow.material.color.set(this.defaultOutlineColor);
    }
  }

  getData() {
    const me = this;
    return {
      type: 'line',
      key: me.key,
      options: me.options
    }
  }

  destroy() {
    const me = this;
    super.destroy();
    me.line = undefined;
    me.matLine = undefined;
    me.arrow = undefined;
  }

}