import { SIDE_DARK_COLOR, SIDE_LIGHT_COLOR, TOP_COLOR } from "@/engine/constant";
import { Render } from "@/engine/render";
import * as THREE from "three";
import { Line2, LineGeometry, LineMaterial } from "three/addons";
import { Base3DObject } from "../base";
import { Utils } from "@/engine/utils";
import { BaseOptions } from "@/engine/interface";

export interface LineOptions extends BaseOptions {
  points: number[],
  startElementKey?: string,
  endElementKey?: string,
  color?: string,
  opacity?: number,
  lineWidth?: number,
}


export class Line extends Base3DObject<LineOptions> {
  groundGap = 0;

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

    line.userData.pickable = true;
    line.userData.key = this.key;
    this.line = line;
    me.add(line);
    me.updateBreakPoints();
  }

  // 获取点位信息
  getPoints() {
    return this.options.points
  }
  
  // 获取起点位置
  getStartPoints() {
    return [this.options.points[0], this.options.points[1], this.options.points[2]]
  }

  // 获取终点位置
  getEndPoints() {
    const length = this.options.points.length
    return [this.options.points[length - 3], this.options.points[length - 2], this.options.points[length - 1]]
  }

  updatePoints(points: number[]) {
    const oldGeometry = this.line?.geometry as LineGeometry;
    if (!this.line || !oldGeometry) { return; }
    const newGeometry = new LineGeometry();
    newGeometry?.setPositions(points);
    newGeometry.attributes.position.needsUpdate = true;
    this.line?.computeLineDistances();
    this.line.geometry = newGeometry;
    this.options.points = points;
    oldGeometry.dispose();
    this.updateBreakPoints();
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
      const x = points[i]
      const y = points[i + 1]
      const z = points[i + 2]
      const geometry = new THREE.SphereGeometry(0.03, 8, 8);
      const material = new THREE.MeshBasicMaterial({ color: this.defaultOutlineColor });
      const point = new THREE.Mesh(geometry, material);
      point.position.set(x, y, z);
      pointsGroup.add(point)
    }

    this.pointsGroup = pointsGroup;
    me.add(pointsGroup)
  }

  active() {
    if (this.matLine) {
      this.matLine.linewidth = this.lineWdithActive
      this.matLine.color.set(this.activeOutlineColor)
    }
  }

  disActive() {
    if (this.matLine) {
      this.matLine.linewidth = this.lineWdith;
      this.matLine.color.set(this.defaultOutlineColor)
    }
  }

  getData() {
    const me = this;
    return {
      type: 'line',
      options: me.options
    }
  }

  destroy() {
    const me = this;
    super.destroy();
    me.line = undefined;
    me.matLine = undefined;
  }

}