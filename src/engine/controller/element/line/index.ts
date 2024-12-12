import { SIDE_DARK_COLOR, SIDE_LIGHT_COLOR, TOP_COLOR } from "@/engine/constant";
import { Render } from "@/engine/render";
import * as THREE from "three";
import { Line2, LineGeometry, LineMaterial } from "three/addons";
import { Base3DObject } from "../base";

export interface LineOptions {
  points: number[]
}


export class Line extends Base3DObject {
  groundGap = 0.01;

  lineWdith = 0.03;
  lineWdithActive = 0.03;

  line?: Line2;

  matLineOptions = {
    color: this.defaultOutlineColor,
    linewidth: this.lineWdith,
    worldUnits: true,
    dashed: false,
    alphaToCoverage: true,
    vertexColors: false,
  }

  matLine?: LineMaterial = new LineMaterial(this.matLineOptions);

  constructor(engine: Render, private options: LineOptions) {
    super(engine);
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

  getStartPoints() {
    return [this.options.points[0], this.options.points[1], this.options.points[2]]
  }

  getEndPoints() {
    const length = this.options.points.length
    return [this.options.points[length - 3], this.options.points[length - 2], this.options.points[length - 1]]
  }

  updatePoints(points: number[]) {
    const geometry = this.line?.geometry as LineGeometry;
    if (!geometry) { return }
    geometry?.setPositions(points);
    geometry.attributes.position.needsUpdate = true;
    this.line?.computeLineDistances();
    this.options.points = points;
  }

  setPositions() {

  }

  getLinePoints() {
    if (!this.line) { return []; }
    const geometry = this.line.geometry as LineGeometry;
    const positions = geometry.attributes.position.array;
    const itemSize = geometry.attributes.position.itemSize; // 每个顶点的大小（通常是3）
    const count = geometry.attributes.position.count; // 顶点数量

    const points = [];
    for (let i = 0; i < count; i++) {
      const x = positions[i * itemSize];
      const y = positions[i * itemSize + 1];
      const z = positions[i * itemSize + 2];
      points.push(x, y, z);
    }
    return points;
  }

  // 更新折点
  updateBreakPoints() {
    const me = this;
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
    const position = me?.position
    if (!position) return;
    const { x, z } = position;
    return {
      type: 'line',
      options: {
        x,
        z,
        points: me.options.points,
      }
    }
  }

  destroy() {
    const me = this;
    this.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        child?.parent?.remove(child);
        child.geometry.dispose();
        if (child.material instanceof Array) {
          child.material.forEach(material => {
            material.dispose();
          });
        } else {
          child.material.dispose();
        }
      }
    });
    me.line = undefined;
    me.matLine = undefined;
    super.destroy();
  }

}