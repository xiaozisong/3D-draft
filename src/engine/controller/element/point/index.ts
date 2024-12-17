import { SIDE_DARK_COLOR, SIDE_LIGHT_COLOR, TOP_COLOR } from "@/engine/constant";
import { BaseOptions } from "@/engine/interface";
import { Render } from "@/engine/render";
import * as THREE from "three";
import { LineMaterial } from "three/addons";
import { Base3DObject } from "../base";

export interface PointOptions extends BaseOptions {
  x: number,
  y: number,
  z: number,
  index?: number,
  lineKey?: string,
}

export class Point extends Base3DObject<PointOptions> {
  point: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap> | undefined

  constructor(engine: Render, options: PointOptions) {
    super(engine, options);
    this.init();
  }

  init () {
    const me = this;
    const { x, y, z } = me.options;
    const geometry = new THREE.SphereGeometry(0.03, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: this.defaultOutlineColor });
    const point = new THREE.Mesh(geometry, material);

    me.point = point;
    me.add(point);
    me.position.set(x, y, z);
  }

  active() {
    if (this.point) {
      this.point.material.color.set(this.activeOutlineColor);
    }
  }

  disActive() {
    if (this.point) {
      this.point.material.color.set(this.defaultOutlineColor);
    }
  }

  getData() {
    const me = this;
    const position = me?.position;
    if (!position) return;

    return {
      key: me.key,
      type: 'point',
      options: {
        ...me.options,
      }
    }
  }

  destory() {
    const me = this;
    super.destroy();
    me.point = undefined;
  }
}