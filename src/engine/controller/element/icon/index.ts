import { TOP_COLOR } from "@/engine/constant";
import { BaseOptions } from "@/engine/interface";
import { Render } from "@/engine/render";
import { Utils } from "@/engine/utils";
import { Color } from "antd/es/color-picker";
import * as THREE from "three";
import { Line2, LineGeometry, LineMaterial, SVGLoader } from "three/addons";
import { Unit3DObject } from "../unit";
import IconSchema from "./schema";

export interface IconOptions extends BaseOptions {
  x: number,
  z: number,
  y: number,
  size: number,
  depth: number,
  color: string,

  type: string,
}

export class Icon extends Unit3DObject<IconOptions> {
  static schema = IconSchema;
  iconDir = "icon/ant-icon-filled";
  name: string = '图标';
  lineWdith = 0.03;
  // 轮廓线边距
  outlinePadding = 0.1;

  // 图标group
  icon: any;

  // 线条材质
  matLine?: LineMaterial = new LineMaterial({
    color: this.activeOutlineColor,
    linewidth: this.lineWdith,
    worldUnits: true,
    dashed: false,
    alphaToCoverage: true,
    vertexColors: false,
  });

  // 轮廓线
  line?: Line2;

  // 形状
  shapes?: THREE.Shape[];

  // 缩放比例
  scaleRatio?: number;

  // svg原始宽度
  svgWidth?: number;

  // 适配系数
  coefficient: number = 1024 / 200;

  constructor(engine: Render, options: IconOptions) {
    super(engine, options);
    this.init();
  }

  init() {
    const me = this;

    if (!me.options?.color) {
      me.setOptions({
        color: TOP_COLOR,
      });
    }
    if (!me.options.size) {
      me.setOptions({
        size: 1
      });
    }
    if (!me.options.depth) {
      me.setOptions({
        depth: 0.01
      });
    }
    if (!me.options.type) {
      me.setOptions({
        type: 'cloud'
      });
    }
    const { x, z, y, size, depth, type } = me.options;
    const url = me.iconDir + "/" + type + ".svg";
    me.position.x = x;
    me.position.z = z;
    me.position.y = y;

    me.engine.loader.load(url, function (data) {
      const paths = data.paths;

      const svgElement = data.xml as unknown as SVGElement;
      me.svgWidth = Utils.Dom.getSVGWidth(svgElement).width;
      me.coefficient = 1024 / me.svgWidth;
      const icon = new THREE.Group();

      me.scaleRatio = size / me.svgWidth / me.coefficient;

      icon.scale.set(me.scaleRatio, me.scaleRatio, me.scaleRatio);

      let renderOrder = 0;
      const depthScale = depth / me.scaleRatio;

      // 定义基础设置，设置厚度
      const extrudeSettings = {
        steps: 1,
        depth: depthScale, // 这里设置厚度
        bevelEnabled: false,
      };
      const { topColor, sideColorX, sideColorZ, otherColor } = me.getColor();

      paths.forEach((path) => {
        const material = [
          new THREE.MeshBasicMaterial({
            color: topColor,
            side: THREE.DoubleSide,
          }),
          new THREE.MeshBasicMaterial({
            color: sideColorZ,
            side: THREE.DoubleSide,
          })
        ];

        const shapes = SVGLoader.createShapes(path);

        me.shapes = shapes;

        shapes.forEach((shape) => {
          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.renderOrder = renderOrder++;
          icon.add(mesh);
        });
      });
      
      icon.position.y = me.svgWidth * me.scaleRatio * me.coefficient / 2;
      icon.position.x = me.svgWidth * me.scaleRatio * me.coefficient / 2;
      icon.position.z = -depth;

      me.add(icon);

      me.icon = icon;
      me.rotation.x = Math.PI / 2;
    });
  }

  // 新增轮廓线
  addLine() {
    const me = this;
    const boundingBox = Utils.getBoundingBox(this);
    const { z: length } = Utils.getGroupSize(this);

    const { max, min } = boundingBox;
    const padding = this.outlinePadding;
    const position = this.position;
    const lineHeight = 0;
    const positions = [
      max.x + padding - position.x, min.z - position.z - lineHeight * length - padding, 0,
      min.x - padding - position.x, min.z - position.z - lineHeight * length - padding, 0,
      min.x - padding - position.x, max.z - position.z - lineHeight * length + padding, 0,
      max.x + padding - position.x, max.z - position.z - lineHeight * length + padding, 0,
      max.x + padding - position.x, min.z - position.z - lineHeight * length - padding, 0,
    ]
    const lineGeometry = new LineGeometry();
    lineGeometry.setPositions(positions);
    const line = new Line2(lineGeometry, me.matLine);
    line.computeLineDistances();
    // line.scale.set(1, 1, 1);
    this.line = line;
    this.add(line);
  }

  // 更新轮廓线
  updateLine() {
    const me = this;
    const boundingBox = Utils.getBoundingBox(this);
    const { z: length } = Utils.getGroupSize(this);

    const { max, min } = boundingBox;
    const padding = this.outlinePadding;
    const position = this.position;
    const lineHeight = 0;
    const positions = [
      max.x + padding - position.x, min.z - position.z - lineHeight * length - padding, 0,
      max.x - padding - position.x, min.z - position.z - lineHeight * length - padding, 0,
      max.x - padding - position.x, max.z - position.z - lineHeight * length + padding, 0,
      max.x + padding - position.x, max.z - position.z - lineHeight * length + padding, 0,
      max.x + padding - position.x, min.z - position.z - lineHeight * length - padding, 0,
    ];
    const lineGeometry = me.line?.geometry as LineGeometry;
    lineGeometry.setPositions(positions);
    const line = this.line as Line2;
    line.computeLineDistances();
  }

  // 改变尺寸
  updateSize({ value, type }: { value: number, type: string }) {
    const me = this;
    me.setOptions({
      [type]: value,
    });
    if (!this.icon || !me.scaleRatio || !me.svgWidth) { return; }
    const { size } = me.options;
    const icon = this.icon;
    const newScaleRatio = size / me.svgWidth / me.coefficient;
    icon.scale.set(newScaleRatio, newScaleRatio, me.scaleRatio);
    icon.position.y = - me.svgWidth * newScaleRatio * me.coefficient / 2;
    icon.position.x = - me.svgWidth * newScaleRatio * me.coefficient / 2;
    Utils.Render.executeAfterFrames(me.updateLine.bind(me), 2);
  }

  // 改变厚度
  updateDepth({ value, type }: { value: number, type: string }) {
    const me = this;
    me.setOptions({
      [type]: value,
    });
    if (!this.icon || !me.shapes || !me.scaleRatio) { return; }
    const { depth } = me.options;
    const icon = this.icon;
    let renderOrder = 0;
    const depthScale = depth / me.scaleRatio;
    // 定义挤出设置, 设置厚度
    const extrudeSettings = {
      steps: 1,
      depth: depthScale, // 这里设置厚度
      bevelEnabled: false,
    };
    me.shapes.forEach((shape, index) => {
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      icon.children[index].geometry.dispose();
      icon.children[index].geometry = geometry;
      icon.children[index].renderOrder = renderOrder++;
    });
    icon.position.z = -depth;
  }

  // 改变颜色
  updateColor({ value, type }: { value: Color, type: string }) {
    const me = this;
    const color = value.toHexString ? value.toHexString() : value;
    me.setOptions({
      [type]: color,
    });
    if (!this.icon) { return; }
    const { topColor, sideColorX, sideColorZ, otherColor } = me.getColor();

    const newMaterial = [
      new THREE.MeshBasicMaterial({
        color: topColor,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        color: sideColorZ,
        side: THREE.DoubleSide,
      })
    ];

    const icons = this.icon.children;
    for (let i = 0; i < icons.length; i++) {
      const icon = icons[i];
      const materials = icon.material;
      materials.forEach((mat: THREE.MeshBasicMaterial) => {
        mat.dispose();
      });
      icon.material = newMaterial;
    }
  }

  // 更新图标类型
  updateType({ value, type }: { value: string, type: string }) {
    const me = this;
    me.setOptions({
      [type]: value,
    });
    if (!me.icon) { return; }
    this.syncPosition();
    Utils.disposeGroup(me.icon);
    me.init();
    Utils.Render.executeAfterFrames(me.updateLine.bind(me), 2);
  }

  active() {
    this.addLine();
  }

  disActive() {
    if (this.line) {
      this.remove(this.line);
      this.line.geometry.dispose();
      this.line.material.dispose();
      this.line = undefined;
    }
  }

  getData() {
    const me = this;
    const position = me?.position
    if (!position) return;
    const { x, z, y } = position;
    return {
      type: 'icon',
      key: me.key,
      options: {
        ...me.options,
        x,
        z,
        y,
      }
    }
  }

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
    me.icon = undefined;
    me.matLine = undefined;
    me.line = undefined;
    me.shapes = undefined;
    super.destroy();
  }

}