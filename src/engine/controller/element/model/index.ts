import { TOP_COLOR } from "@/engine/constant";
import { BaseOptions } from "@/engine/interface";
import { Render } from "@/engine/render";
import { Utils } from "@/engine/utils";
import { Color } from "antd/es/color-picker";
import * as THREE from "three";
import { Line2, LineGeometry, LineMaterial } from "three/addons";
import { Unit3DObject } from "../unit";
import ModelSchema from './schema';

export interface ModelOptions extends BaseOptions {
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  length: number,
  color?: string,
}

export class Model extends Unit3DObject<ModelOptions> {
  static schema = ModelSchema;
  name = '模型';

  lineWidth = 0.02;
  lineWidthActive = 0.03;



  matLineOptions = {
    color: this.defaultOutlineColor,
    lineWdith: this.lineWidth,
    worldUnits: true,
    dashed: false,
    alphaToCoverage: true,
    vertexColors: false,
  }

  matLine?: LineMaterial = new LineMaterial(this.matLineOptions);

  outLine?: THREE.Group<THREE.Object3DEventMap>;


  model?: THREE.Group<THREE.Object3DEventMap>;

  type: string = 'ford_mustang_gt';

  constructor(engine: Render, options: ModelOptions) {
    super(engine, options);
    this.init();
  }

  init() {
    const me = this;
    const { length = 1, width = 1, height = 0.5 } = me.options;

    const modelDir = `gltf/${me.type}`;
    const url = `${modelDir}/scene.gltf`;

    me.position.x = me.options.x;
    me.position.y = me.options.y;
    me.position.z = me.options.z;

    me.engine.GLTFLoader.load(
      url,
      function (gltf) {
        const modelScene = gltf.scene;

        modelScene.scale.set(1, 1.25, 1);
        modelScene.rotation.y = Math.PI;

        const box = new THREE.Box3().setFromObject(modelScene);
        const height = box.max.y - box.min.y;
        const center = new THREE.Vector3();
        box.getCenter(center);

        // 将模型平移到中心点
        modelScene.position.x -= center.x;
        modelScene.position.y -= center.y;
        modelScene.position.z -= center.z;

        modelScene.position.y = height / 2 - center.y;

        me.add(modelScene);
        me.model = modelScene;

        modelScene.traverse(function (node) {

        });
      },
      function (xhr) {
        // 模型加载进度
      },
      function (error) {
        // 模型加载错误
        console.error('An error happend', error);
      }
    )
  }

  // 改变尺寸
  updateSize({ value, type }: { value: number; type: string; }): void {
    
  }

  // 改变颜色
  updateColor({ value, type }: { value: Color; type: string; }): void {
    const me = this;

  }

  active() {
    if (this.matLine) {
      this.matLine.linewidth = this.lineWidthActive;
      this.matLine.color.set(this.activeOutlineColor);
    }
  }

  disActive() {
    if (this.matLine) {
      this.matLine.linewidth = this.lineWidth;
      this.matLine.color.set(this.defaultOutlineColor);
    }
  }

  getData() {
    const me = this;
    const position = me.position;
    if (!position) { return; }
    const { x, z, y } = position;
    return {
      key: me.key,
      type: 'model',
      options: {
        ...me.options,
        x,
        y,
        z,
      }
    }
  }

  destroy() {
    const me = this;
    super.destroy();
    me.model = undefined;
    me.matLine = undefined;
  }
}