import { TOP_COLOR } from "@/engine/constant";
import { BaseOptions } from "@/engine/interface";
import { Render } from "@/engine/render";
import * as THREE from "three";
import { Line2, LineMaterial, LineGeometry } from "three/addons";
import { Unit3DObject } from "../unit";
import CubeSchema from "./schema";
import { Color } from "antd/es/color-picker";
import { Utils } from "@/engine/utils";

export interface CubeOptions extends BaseOptions {
  x: number,
  z: number,
  y: number,
  width: number,
  height: number,
  length: number,
  color?: string,
}

export class Cube extends Unit3DObject<CubeOptions> {
  static schema = CubeSchema;
  name: string = '立方体';

  lineWdith = 0.02;
  lineWdithActive = 0.03;

  cube?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial[], THREE.Object3DEventMap>

  matLineOptions = {
    color: this.defaultOutlineColor,
    linewidth: this.lineWdith,
    worldUnits: true,
    dashed: false,
    alphaToCoverage: true,
    vertexColors: false,
  }

  matLine?: LineMaterial = new LineMaterial(this.matLineOptions);

  outLine?: THREE.Group<THREE.Object3DEventMap>;

  constructor(engine: Render, options: CubeOptions) {
    super(engine, options);
    this.init();
  }

  init() {
    const me = this;
    const { length = 1, width = 1, height = 0.5 } = me.options;
    const geometry = new THREE.BoxGeometry(length, height, width);
    const { topColor, sideColorZ, sideColorX, otherColor } = me.getColor();

    var material = [
      new THREE.MeshBasicMaterial({ color: sideColorX }), // 前面
      new THREE.MeshBasicMaterial({ color: otherColor }), // 后面
      new THREE.MeshBasicMaterial({ color: topColor }), // 顶面
      new THREE.MeshBasicMaterial({ color: otherColor }), // 底面
      new THREE.MeshBasicMaterial({ color: sideColorZ }), // 左面
      new THREE.MeshBasicMaterial({ color: otherColor }), // 右面
    ];

    // const textTexture = new THREE.CanvasTexture(
    //   Utils.getTextCanvas({ text: "T2", width: 1000, height: 1000 })
    // );
    // material[2] = new THREE.MeshBasicMaterial({ map: textTexture }); 

    const cube = new THREE.Mesh(geometry, material);
    geometry.translate(0, height / 2, 0);
    this.position.x = me.options.x;
    this.position.y = me.options.y;
    this.position.z = me.options.z;
    me.cube = cube;

    this.addLine()
    me.add(cube);
  }

  // 添加描边
  addLine() {
    const me = this;
    const cube = me.cube;
    if (!cube) { return }
    const geometry = cube.geometry;
    // 添加线条
    var edges = new THREE.EdgesGeometry(geometry);
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 20 });
    var lines = new THREE.LineSegments(edges, lineMaterial);
    lines.userData.pickable = false;
    cube.add(lines);
  }

  addLine2() {
    const me = this;
    const cube = me.cube;
    if (!cube) { return }
    const geometry = cube.geometry;
    const position = cube.position;

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
        start.x + position.x + 0.01,
        start.y + position.y + 0.01,
        start.z + position.z + 0.01,
        end.x + position.x + 0.01,
        end.y + position.y + 0.01,
        end.z + position.z + 0.01,
      ];

      const lineGeometry = new LineGeometry();
      lineGeometry.setPositions(positions);
      const line = new Line2(lineGeometry, me.matLine);
      line.computeLineDistances();
      lineGroup.add(line);
    }
    this.add(lineGroup);
  }

  // 更新描边
  updateLine() {
    const me = this;
    const cube = me.cube;
    if (!cube) { return }
    const geometry = cube.geometry;
    const position = cube.position;
    
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
        start.x = position.x + 0.01,
        start.y = position.y + 0.01,
        start.z = position.z + 0.01,
        end.x = position.x + 0.01,
        end.y = position.y + 0.01,
        end.z = position.z + 0.01,
      ];
      if (!this.outLine) { return; }
      const line = this.outLine.children[i] as Line2;
      const lineGeometry = line.geometry;
      lineGeometry.setPositions(positions);
      line.computeLineDistances();
    }
  }

  // 改变尺寸
  updateSize({ value, type }: { value: number, type: string }) {
    if (!this.cube || !value || value < 0.25) { return; }
    this.setOptions({
      [type]: value
    });
    const { width, height, length } = this.options;
    const new_geometry = new THREE.BoxGeometry(length, height, width);
    this.cube.geometry.dispose();
    this.cube.geometry = new_geometry;
    this.cube.geometry.translate(0, height / 2, 0);
    this.updateLine();
  }

  // 改变颜色
  updateColor({ value, type }: { value: Color, type: string }) {
    const me = this;
    const color = value.toHexString();
    me.setOptions({
      [type]: color
    });
    if (!this.cube) { return; }
    const { topColor, sideColorZ, sideColorX, otherColor } = me.getColor();
    const newMaterial = [
      new THREE.MeshBasicMaterial({ color: sideColorX }), // 前面
      new THREE.MeshBasicMaterial({ color: otherColor }), // 后面
      new THREE.MeshBasicMaterial({ color: topColor }), // 顶面
      new THREE.MeshBasicMaterial({ color: otherColor }), // 底面
      new THREE.MeshBasicMaterial({ color: sideColorZ }), // 左面
      new THREE.MeshBasicMaterial({ color: otherColor }) // 右面
    ];
    this.cube.material.forEach((mat) => {
      mat.dispose();
    });
    this.cube.material = newMaterial;
  }

  // 更新属性
  updateAttribute({ value, type }: { value: any, type: string }) {
    switch (type) {
      case 'color':
        this.updateColor({ value, type });
        break;
      case 'width':
      case 'length':
      case 'width':
        this.updateSize({ value, type });
        break;
      default:
        break;
    }
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
      type: 'cube',
      key: me.key,
      options: {
        ...me.options,
        x,
        y,
        z
      }
    }
  }

  destroy() {
    const me = this;
    super.destroy();
    me.cube = undefined;
    me.matLine = undefined;
  }

}