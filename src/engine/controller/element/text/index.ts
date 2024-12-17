import { Render } from "@/engine/render";
import * as THREE from "three";
import { Line2, LineGeometry, LineMaterial } from "three/addons";
import { Text as TextMesh } from 'troika-three-text';
import { Base3DObject } from "../base";
import { BaseOptions } from "@/engine/interface";

export interface TextOptions extends BaseOptions {
  x: number,
  z: number,
  content: string,
  color: string,
  fontSize: number,
  fontWeight: string,
}


export class Text extends Base3DObject<TextOptions> {
  lineWdith = 0.03;
  groundGap = 0.01;
  outlinePadding = 0.05;

  text: any;

  matLine?: LineMaterial = new LineMaterial({
    color: this.activeOutlineColor,
    linewidth: this.lineWdith,
    worldUnits: true,
    dashed: false,
    alphaToCoverage: true,
    vertexColors: false,
  });

  line?: Line2;

  constructor(engine: Render, options: TextOptions) {
    super(engine, options);
    this.init();
  }

  init() {
    const me = this;
    const { x, z, content, color, fontSize, fontWeight } = me.options
    this.position.x = x;
    this.position.z = z;

    let text = new TextMesh();
    text.font = 'MicrosoftYahei.ttf';
    text.text = content;
    text.fontSize = fontSize;
    text.color = color;
    text.fontWeight = fontWeight;
    text.outlineColor = '#ffffff'
    text.outlineWidth = 0.02;

    text.sync()

    
    this.add(text);
    
    this.text = text;
    this.position.y = this.groundGap;
    this.rotation.x = - Math.PI / 2;

  }


  addLine() {
    const me = this;
    const boundingBox = this.text.geometry.boundingBox;
    const { max, min } = boundingBox
    const padding = this.outlinePadding;
    const positions = [
      max.x + padding, min.y - padding, 0,
      min.x - padding, min.y - padding, 0,
      min.x - padding, max.y + padding, 0,
      max.x + padding, max.y + padding, 0,
      max.x + padding, min.y - padding, 0,
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
      type: 'text',
      key: me.key,
      options: {
        ...me.options,
        x,
        z,
        content: me.text?.text,
        color: me.text?.color,
        fontSize: me.text?.fontSize,
        fontWeight: me.text?.fontWeight,
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
    me.text = undefined;
    me.matLine = undefined;
    me.line = undefined
    super.destroy();
  }

}