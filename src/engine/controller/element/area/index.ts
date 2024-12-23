import { Render } from "@/engine/render";
import * as THREE from "three";
import { Line2, LineGeometry, LineMaterial } from "three/addons";
import { Text as TextMesh } from 'troika-three-text';
import { Base3DObject, IBase3DObject } from "../base";
import { BaseOptions } from "@/engine/interface";
import { Unit3DObject } from "../unit";
import AreaSchema from './schema';
import { TOP_COLOR } from "@/engine/constant";
import { Utils } from "@/engine/utils";
import { Color } from "antd/es/color-picker";

export interface AreaOptions extends BaseOptions{
  x: number,
  z: number,
  width: number,
  height: number,
  length: number,
  color: string,
  opacity: number,
};

export class Area extends Unit3DObject<AreaOptions> {
  static schema = AreaSchema;
  name: string = '平面';
  lineWdith = 0.03;
  groundGap = 0;
  outlinePadding = 0;

  area: any;

  matLine?: LineMaterial = new LineMaterial({
    color: this.activeOutlineColor,
    linewidth: this.lineWdith,
    worldUnits: true,
    dashed: false,
    alphaToCoverage: true,
    vertexColors: false,
  });

  line?: Line2;

  matData = {
    transparent: true,
    opacity: 0.5,
  }

  constructor(engine: Render, options: AreaOptions) {
    super(engine, options);
    this.init();
  };

  getColor() {
    const color = this.options.color || TOP_COLOR;
    const topColor = color;
    const sideColorZ = Utils.Color.darkenColor(color, 10);
    const sideColorX = Utils.Color.darkenColor(color, 20);
    const otherColor = Utils.Color.darkenColor(color, 30);
    return { topColor, sideColorZ, sideColorX, otherColor };
  }

  init() {
    const me = this;
    const { x, z, color, width, height, length, opacity = 0.5 } = me.options
    this.position.x = x;
    this.position.z = z;

    // 创建平面几何体
    const geometry = new THREE.BoxGeometry(length, height, width);

    const { topColor, sideColorX, sideColorZ, otherColor } = this.getColor();

    me.matData.opacity = opacity;

    // 创建网格材质
    const material = [
      new THREE.MeshBasicMaterial({ ...this.matData, color: sideColorX }), // 前面
      new THREE.MeshBasicMaterial({ ...this.matData, color: otherColor }), // 后面
      new THREE.MeshBasicMaterial({ ...this.matData, color: topColor }), // 顶面
      new THREE.MeshBasicMaterial({ ...this.matData, color: otherColor }), // 底面
      new THREE.MeshBasicMaterial({ ...this.matData, color: sideColorZ }), // 左面
      new THREE.MeshBasicMaterial({ ...this.matData, color: otherColor }), // 右面
    ];

    // 创建网格对象
    const area = new THREE.Mesh(geometry, material);

    // this.rotation.x = - Math.PI / 2;
    this.position.y = this.groundGap;

    this.area = area;

    this.add(area);

  }

  addOutLine() {
    const me = this;
    const width = this.area.geometry.parameters.width;
    const length = this.area.geometry.parameters.depth;
    const padding = this.outlinePadding;
    const positions = [
      width / 2 + padding, 0, -length / 2 - padding,
      width / 2 + padding, 0, length / 2 + padding,
      -width / 2 - padding, 0, length / 2 + padding,
      -width / 2 - padding, 0, -length / 2 - padding,
      width / 2 + padding, 0, -length / 2 - padding,
    ]
    const lineGeometry = new LineGeometry();
    lineGeometry.setPositions(positions);
    const line = new Line2(lineGeometry, me.matLine);
    line.computeLineDistances();
    this.line = line;
    this.add(line);
  };

  // 更新轮廓线
  updateOutLine() {
    const me = this;
    if (!me.line) { return; }
    const width = this.area.geometry.parameters.width;
    const length = this.area.geometry.parameters.depth;
    const padding = this.outlinePadding;
    const positions = [
      width / 2 + padding, 0, -length / 2 - padding,
      width / 2 + padding, 0, length / 2 + padding,
      -width / 2 - padding, 0, length / 2 + padding,
      -width / 2 - padding, 0, -length / 2 - padding,
      width / 2 + padding, 0, -length / 2 - padding,
    ];
    const lineGeometry = me.line.geometry;
    lineGeometry.setPositions(positions);
    const line = me.line;
    line.computeLineDistances();
  }

  // 改变尺寸
  changeSize({ value, type }: { value: number, type: string }) {
    if (!this.area || !value || value < 0.01) { return; }
    this.setOptions({
      [type]: value,
    });
    const { width, height, length } = this.options;
    const new_geometry = new THREE.BoxGeometry(length, height, width);
    this.area.geometry.dispose();
    this.area.geometry = new_geometry;
    this.area.geometry.translate(0, height / 2, 0);
    this.updateOutLine();
  }

  // 改变材质
  updateMaterial() {
    const me = this;
    const { topColor, sideColorX, sideColorZ, otherColor } = this.getColor();
    this.matData.opacity = me.options.opacity;
    const newMaterial = [
      new THREE.MeshBasicMaterial({ ...this.matData, color: sideColorX }), // 前面
      new THREE.MeshBasicMaterial({ ...this.matData, color: otherColor }), // 后面
      new THREE.MeshBasicMaterial({ ...this.matData, color: topColor }), // 顶面
      new THREE.MeshBasicMaterial({ ...this.matData, color: otherColor }), // 底面
      new THREE.MeshBasicMaterial({ ...this.matData, color: sideColorZ }), // 左面
      new THREE.MeshBasicMaterial({ ...this.matData, color: otherColor }), // 右面
    ];
    this.area.material.forEach((mat: THREE.MeshBasicMaterial) => {
      mat.dispose();
    });
    this.area.material = newMaterial;
  }

  // 改变颜色
  changeColor({ value, type }: { value: Color, type: string }) {
    const me = this;
    const color = value.toHexString();
    me.setOptions({
      [type]: color,
    });
    if (!this.area) { return; }
    me.updateMaterial();
  }

  // 改变透明度
  changeOpacity({ value, type }: { value: number, type: string }) {
    const me = this;
    me.setOptions({
      [type]: value,
    });
    if (!this.area) { return; }
    me.matData.opacity = value;
    me.updateMaterial();
  }

  active() {
    this.addOutLine();
  };

  disActive() {
    if (this.line) {
      this.remove(this.line);
      this.line.geometry.dispose();
      this.line.material.dispose();
      this.line = undefined;
    };
  };

  getData() {
    const me = this;
    const position = me?.position
    if (!position) return;
    const { x, z } = position;
    return {
      type: 'area',
      key: me.key,
      options: {
        ...me.options,
        x,
        z,
        width: me.area?.geometry.parameters.width,
        length: me.area?.geometry.parameters.height,
        color: me.area?.material.color,

      }
    };
  };

  destroy() {
    const me = this;
    this.children.forEach((child: any) => {
      if (child?.dispose) {
        child.dispose();
      }
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
    me.area = undefined;
    me.matLine = undefined;
    me.line = undefined
    super.destroy();
  }

};