import { Render } from "@/engine/render";
import * as THREE from "three";
import { Line2, LineGeometry, LineMaterial, SVGLoader } from "three/addons";
import { Base3DObject } from "../base";
import { Utils } from "@/engine/utils";
import { BaseOptions } from "@/engine/interface";
import { Unit3DObject } from "../unit";

export interface IconOptions extends BaseOptions {
  x: number,
  z: number,
  size: number,
  color: string,

}

export class Icon extends Unit3DObject<IconOptions> {
  name: string = '图标';
  lineWdith = 0.03;
  groundGap = 0.01;
  outlinePadding = 0.1;

  icon: any;

  matLine?: LineMaterial = new LineMaterial({
    color: this.activeOutlineColor,
    linewidth: this.lineWdith,
    worldUnits: true,
    dashed: false,
    alphaToCoverage: true,
    vertexColors: false,
  });

  line?: Line2;

  svgUrl = 'user.svg';

  constructor(engine: Render, options: IconOptions) {
    super(engine, options);
    this.init();
  }

  init() {
    const me = this;
    const { x, z, color, size } = me.options
    this.position.x = x;
    this.position.z = z;

    me.engine.loader.load(this.svgUrl, function (data) {
      const paths = data.paths;
      const icon = new THREE.Group();
      icon.scale.multiplyScalar(size / 1024);
      icon.scale.y *= - 1;

      let renderOrder = 0;

      paths.forEach((path) => {
        const material = new THREE.MeshBasicMaterial({
          color,
          side: THREE.DoubleSide,
          // depthWrite: false
        });

        const shapes = SVGLoader.createShapes(path);

        shapes.forEach((shape) => {
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.renderOrder = renderOrder++;
          icon.add(mesh);
        });
      });

      const iconSize = Utils.getGroupSize(icon);
      const { x: iconWidth, y: iconHeight } = iconSize;
      icon.position.y = iconHeight / 1.27;
      icon.position.x = iconWidth / 1.15;

      me.add(icon);

      me.icon = icon;
      me.position.y = me.groundGap;
      me.rotation.x = -Math.PI / 2;
    });
  }


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
    line.scale.set(1, 1, 1);
    this.line = line
    this.add(line);
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
    const { x, z } = position;
    return {
      type: 'icon',
      key: me.key,
      options: {
        ...me.options,
        x,
        z,
        size: me.icon?.scale.x * 1024,
        color: me.options.color,

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
    me.line = undefined
    super.destroy();
  }

}