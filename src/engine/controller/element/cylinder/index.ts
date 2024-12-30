import * as THREE from "three";
import { RenderPass, EffectComposer, OutlinePass, LineMaterial, LineGeometry, Line2 } from "three/addons";
import { Render } from "@/engine/render";
import { Base3DObject } from "../base";
import { Utils } from "@/engine/utils";
import { nanoid } from 'nanoid';
import { SIDE_LIGHT_COLOR, TOP_COLOR } from "@/engine/constant";
import { BaseOptions } from "@/engine/interface";
import { Unit3DObject } from "../unit";
import CylinderSchema from "./schema";
import { Color } from "antd/es/color-picker";

export interface CylinderOptions extends BaseOptions {
  x: number,
  z: number,
  y: number,
  color: string,
  radius: number,
  height: number,
}

export class Cylinder extends Unit3DObject<CylinderOptions> {
  static schema = CylinderSchema;
  name: string = '棱柱体';
  lineWdith = 0.02;
  lineWdithActive = 0.03;

  radialSegments = 8;
  cylinder?: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial[], THREE.Object3DEventMap>

  matLine?: LineMaterial = new LineMaterial({
    color: this.defaultOutlineColor,
    linewidth: this.lineWdith,
    worldUnits: true,
    dashed: false,
    alphaToCoverage: true,
    vertexColors: false,
  });

  outLine?: THREE.Group<THREE.Object3DEventMap>;
  constructor(engine: Render, options: CylinderOptions) {
    super(engine, options);
    this.init();
  }

  init() {
    const me = this;

    if (!me.options.radius) {
      me.setOptions({ radius: 0.5 });
    }
    if (!me.options.height) {
      me.setOptions({ height: 0.5 });
    }
    if (!me.options.color) {
      me.setOptions({ color: TOP_COLOR });
    }
    const { radius, height } = me.options;

    // 创建圆柱体几何体
    const radiusTop = 0.538 * radius * 2; // 顶部半径
    const radiusBottom = 0.538 * radius * 2; // 底部半径
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, this.radialSegments);

    const { topColor, sideColorX, sideColorZ, otherColor } = this.getColor();

    var material = [
      new THREE.MeshBasicMaterial({ color: sideColorZ }), // 侧面
      new THREE.MeshBasicMaterial({ color: topColor }), // 顶面
      new THREE.MeshBasicMaterial({ color: otherColor }), // 顶面
      new THREE.MeshBasicMaterial({ color: otherColor }), // 底面
      new THREE.MeshBasicMaterial({ color: otherColor }), // 左面
      new THREE.MeshBasicMaterial({ color: otherColor }), // 右面
    ];

    const cylinder = new THREE.Mesh(geometry, material);

    geometry.translate(0, height / 2, 0);

    this.position.x = me.options.x;
    this.position.z = me.options.z;
    this.position.y = me.options.y;

    this.rotateY(180 / this.radialSegments * Math.PI / 180); // 绕y轴旋转45度

    me.cylinder = cylinder;

    this.addLine();
    me.add(cylinder);
  }

  // 添加描边
  addLine() {
    const me = this;
    const mesh = me.cylinder;
    if (!mesh) { return }
    const geometry = mesh.geometry;
    const position = mesh.position;

    // 添加线条
    var edges = new THREE.EdgesGeometry(geometry);
    const edgesArray = edges.attributes.position.array;
    const edgesCoordinates = [];
    for (let i = 0; i < edgesArray.length; i += 6) {
      const start = new THREE.Vector3(edgesArray[i], edgesArray[i + 1], edgesArray[i + 2]);
      const end = new THREE.Vector3(edgesArray[i + 3], edgesArray[i + 4], edgesArray[i + 5]);
      edgesCoordinates.push({ start, end });
    }
    const lineGroup = new THREE.Group();
    this.outLine = lineGroup;
    for (let i = 0; i < edgesCoordinates.length; i++) {
      const start = edgesCoordinates[i].start;
      const end = edgesCoordinates[i].end;
      const positions = [
        start.x + position.x,
        start.y + position.y,
        start.z + position.z,
        end.x + position.x,
        end.y + position.y,
        end.z + position.z,
      ];

      const lineGeometry = new LineGeometry();
      lineGeometry.setPositions(positions);
      const line = new Line2(lineGeometry, me.matLine);
      line.computeLineDistances();
      line.scale.set(1.01, 1.01, 1.01);
      lineGroup.add(line);
    }
    me.add(lineGroup);
  }

  // 更新描边
  updateLine() {
    const me = this;
    const mesh = me.cylinder;
    if (!mesh) { return; }
    const geometry = mesh.geometry;
    const position = mesh.position;

    // 添加线条
    var edges = new THREE.EdgesGeometry(geometry);
    const edgesArray = edges.attributes.position.array;
    const edgesCoordinates = [];
    for (let i = 0; i < edgesArray.length; i += 6) {
      const start = new THREE.Vector3(edgesArray[i], edgesArray[i + 1], edgesArray[i + 2]);
      const end = new THREE.Vector3(edgesArray[i + 3], edgesArray[i + 4], edgesArray[i + 5]);
      edgesCoordinates.push({ start, end });
    }
    for (let i = 0; i < edgesCoordinates.length; i++) {
      const start = edgesCoordinates[i].start;
      const end = edgesCoordinates[i].end;
      const positions = [
        start.x + position.x,
        start.y + position.y,
        start.z + position.z,
        end.x + position.x,
        end.y + position.y,
        end.z + position.z,
      ];

      if (!this.outLine) { return; }
      const line = this.outLine.children[i] as Line2;
      const lineGeometry = line.geometry;
      lineGeometry.setPositions(positions);
      line.computeLineDistances();
      line.scale.set(1.01, 1.01, 1.01);
    }
  }

  // 改变尺寸
  changeSize({ value, type }: { value: number, type: string }) {
    const me = this;
    if (!this.cylinder || !value || value < 0.25) { return; }
    this.setOptions({
      [type]: value,
    });
    const { radius = 1, height = 0.5 } = me.options;

    // 创建圆柱几何体
    const radiusTop = 0.538 * radius * 2; // 顶部半径
    const radiusBottom = 0.538 * radius * 2; // 底部半径

    const new_geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, this.radialSegments);

    this.cylinder.geometry.dispose();
    this.cylinder.geometry = new_geometry;
    this.cylinder.geometry.translate(0, height / 2, 0);
    this.updateLine();
  }

  // 改变颜色
  changeColor({ value, type }: { value: Color, type: string }) {
    const me = this;
    const color = value.toHexString();
    me.setOptions({
      [type]: color,
    });
    if (!this.cylinder) { return; }
    const { topColor, sideColorX, sideColorZ, otherColor } = me.getColor();
    const newMaterial = [
      new THREE.MeshBasicMaterial({ color: sideColorZ }), // 侧面
      new THREE.MeshBasicMaterial({ color: topColor }), // 顶面
      new THREE.MeshBasicMaterial({ color: otherColor }), // 前面
      new THREE.MeshBasicMaterial({ color: otherColor }), // 底面
      new THREE.MeshBasicMaterial({ color: otherColor }), // 左面
      new THREE.MeshBasicMaterial({ color: otherColor }), // 右面
    ];
    this.cylinder.material.forEach((mat) => {
      mat.dispose();
    });
    this.cylinder.material = newMaterial;
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
    const { x, z, y } = position;
    return {
      type: 'cylinder',
      key: me.key,
      options: {
        ...me.options,
        x,
        z,
        y
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
    me.cylinder = undefined;
    me.matLine = undefined;
    super.destroy();
  }

}