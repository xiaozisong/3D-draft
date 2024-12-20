import { Render } from "@/engine/render";
import * as THREE from "three";
import { Line2, LineGeometry, LineMaterial } from "three/addons";
import { Text as TextMesh } from 'troika-three-text';
import { Base3DObject } from "../base";
import { BaseOptions } from "@/engine/interface";
import { Unit3DObject } from "../unit";

export interface TextOptions extends BaseOptions {
  x: number,
  z: number,
  content: string,
  color: string,
  fontSize: number,
  fontWeight: string,
  linkElementKey?: string,
  linkElementRelactionPosition?: THREE.Vector3
}


export class Text extends Unit3DObject<TextOptions> {
  name = '文字';
  lineWdith = 0.03;
  groundGap = 0.2;
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
  linkLine?: Line2;

  constructor(engine: Render, options: TextOptions) {
    super(engine, options);
    this.init();
  }

  init() {
    const me = this;
    const { x, z, content, color, fontSize, fontWeight } = me.options;

    let text = new TextMesh();
    text.font = 'MicrosoftYahei.woff';
    text.text = content;
    text.fontSize = fontSize;
    text.color = color;
    text.fontWeight = fontWeight;
    text.outlineColor = '#ffffff'
    text.outlineWidth = 0.02;
    text.textAlign = 'center';
    text.anchorX = 'center';
    text.anchorY = 'middle';

    text.sync()
    
    this.add(text);
    
    this.text = text;
    this.position.y = this.groundGap;
    this.text.rotation.x = - Math.PI / 2;

    this.position.x = x;
    this.position.z = z;

  }


  addLine() {
    const me = this;
    const boundingBox = this.text.geometry.boundingBox;
    const { max, min } = boundingBox
    const padding = this.outlinePadding;
    const positions = [
      max.x + padding, 0, min.y - padding,
      min.x - padding, 0, min.y - padding,
      min.x - padding, 0, max.y + padding,
      max.x + padding, 0, max.y + padding,
      max.x + padding, 0, min.y - padding,
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
    this.addLinkLine();
  }

  // 新增关联线
  addLinkLine() {
    const me = this;
    if (!me.matLine) {
      return;
    }
    const lineGeometry = new LineGeometry();
    const newMath = me.matLine.clone();
    newMath.dashed = true;
    newMath.dashSize = 0.05;
    newMath.gapSize = 0.05;
    const linkLine = new Line2(lineGeometry, newMath);
    me.linkLine = linkLine;
    me.add(linkLine);
    me.updateLinkLine();
  }

  // 更新关联线
  updateLinkLine() {
    const me = this;
    if (!this.linkLine) {
      return;
    }
    const { linkElementKey, linkElementRelactionPosition } = me.options;
    if (linkElementKey && linkElementRelactionPosition) {
      const linkElement = me.engine.controller.element.getElementByKey(linkElementKey);
      if (!linkElement) { return }
      const positions = [
        linkElement.position.x - me.position.x, linkElement.position.y - me.position.y, linkElement.position.z - me.position.z,
        0, 0, 0,
      ]
      this.linkLine.geometry.setPositions(positions);
      this.linkLine.computeLineDistances();
      this.linkLine.scale.set(1, 1, 1);
    }
  }

  disActive() {
    if (this.line) {
      this.remove(this.line);
      this.line.geometry.dispose();
      this.line.material.dispose();
      this.line = undefined;
    }
    if (this.linkLine) {
      this.remove(this.linkLine);
      this.linkLine.geometry.dispose();
      this.linkLine.material.dispose();
      this.linkLine = undefined;
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
    me.line = undefined;
    me.linkLine = undefined;
    super.destroy();
  }

}