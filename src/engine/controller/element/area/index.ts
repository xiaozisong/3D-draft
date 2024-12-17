import { Render } from "@/engine/render";
import * as THREE from "three";
import { Line2, LineGeometry, LineMaterial } from "three/addons";
import { Text as TextMesh } from 'troika-three-text';
import { Base3DObject, IBase3DObject } from "../base";
import { BaseOptions } from "@/engine/interface";

export interface AreaOptions extends BaseOptions{
  x: number,
  z: number,
  width: number,
  length: number,
  color: string,
};

export class Area extends Base3DObject<AreaOptions> {
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

  constructor(engine: Render, options: AreaOptions) {
    super(engine, options);
    this.init();
  };

  init() {
    const me = this;
    const { x, z, color, width, length } = me.options
    this.position.x = x;
    this.position.z = z;

    // 创建平面几何体
    const geometry = new THREE.PlaneGeometry(width, length);

    // 创建网格材质
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true, opacity: 0.5
      // side: THREE.DoubleSide
    });

    // 创建网格对象
    const area = new THREE.Mesh(geometry, material);

    area.userData.pickable = true;
    area.userData.key = this.key;

    this.rotation.x = - Math.PI / 2;
    this.position.y = this.groundGap;

    this.area = area;

    this.add(area);

  }

  addLine() {
    const me = this;
    const width = this.area.geometry.parameters.width;
    const length = this.area.geometry.parameters.height;
    const padding = this.outlinePadding;
    const positions = [
      width / 2 + padding, -length / 2 - padding, 0,
      width / 2 + padding, length / 2 + padding, 0,
      -width / 2 - padding, length / 2 + padding, 0,
      -width / 2 - padding, -length / 2 - padding, 0,
      width / 2 + padding, -length / 2 - padding, 0,
    ]
    const lineGeometry = new LineGeometry();
    lineGeometry.setPositions(positions);
    const line = new Line2(lineGeometry, me.matLine);
    line.computeLineDistances();
    line.scale.set(1, 1, 1);
    this.line = line
    this.add(line);
  };

  active() {
    this.addLine();
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