import { Render } from "@/engine/render";
import * as THREE from "three";
import { Line2, LineGeometry, LineMaterial } from "three/addons";
import { Text as TextMesh } from 'troika-three-text';
import { Base3DObject } from "../base";
import { BaseOptions } from "@/engine/interface";
import { Unit3DObject } from "../unit";
import TextSchema from "./schema";
import { Color } from "antd/es/color-picker";
import { Utils } from "@/engine/utils";

export interface TextOptions extends BaseOptions {
  x: number,
  z: number,
  y: number,
  text: string,
  color: string,
  fontSize: number,
  fontWeight: string,
  outlineColor?: string,
  outlineWidth?: number, 
  lineHeight?: number,
  linkElementKey?: string,
  linkElementRelactionPosition?: THREE.Vector3
}


export class Text extends Unit3DObject<TextOptions> {
  static schema = TextSchema;

  name = '文字';
  lineWdith = 0.03;
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
    if (!me.options.color) {
      me.options.color = '#000000';
    }
    if (!me.options.fontSize) {
      me.options.fontSize = 0.3;
    }
    if (!me.options.fontWeight) {
      me.options.fontWeight = 'bold';
    }
    if (!me.options.outlineColor) {
      me.options.outlineColor = '#ffffff';
    }
    if (!me.options.lineHeight) {
      me.options.lineHeight = 1.5;
    }
    if (!me.options.outlineWidth) {
      me.options.outlineWidth = 0.02;
    }

    const { 
      x, z, y, text: textContent = 'default text', color, fontSize, fontWeight, lineHeight = 1.5, 
      outlineColor, outlineWidth,
    } = me.options;

    let text = new TextMesh();
    text.font = 'MicrosoftYahei.woff';
    text.textAlign = 'center';
    text.anchorX = 'center';
    text.anchorY = 'middle';
    text.text = textContent;
    text.fontSize = fontSize;
    text.color = color;
    text.fontWeight = fontWeight;
    text.lineHeight = lineHeight;
    text.outlineColor = outlineColor;
    text.outlineWidth = outlineWidth;

    text.sync()
    
    this.add(text);
    
    this.text = text;
    this.text.rotation.x = - Math.PI / 2;

    this.position.x = x;
    this.position.z = z;
    this.position.y = y;

  }


  addOutLine() {
    const me = this;
    if (!this.text) { return; }
    const boundingBox = this.text.geometry.boundingBox;
    const { max, min } = boundingBox
    const padding = (max.x - min.x) / 10;
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
    this.line = line
    this.add(line);
  }

  // 更新边框线
  updateOutLine() {
    const me = this;
    if (!me.line) { return; }
    if (!this.text) { return; }
    const boundingBox = this.text.geometry.boundingBox;
    const { max, min } = boundingBox;
    const padding = (max.x - min.x) / 10;
    const positions = [
      max.x + padding, 0, min.y - padding,
      max.x - padding, 0, min.y - padding,
      max.x - padding, 0, min.y + padding,
      max.x + padding, 0, min.y + padding,
      max.x + padding, 0, min.y - padding,
    ];
    const lineGeometry = me.line.geometry;
    lineGeometry.setPositions(positions);
    const line = me.line;
    line.computeLineDistances();
  }

  // 改变文字颜色
  updateColor({ value, type }: { value: Color, type: string }) {
    const me = this;
    const color = value.toHexString ? value.toHexString() : value;
    if (!this.text) { return; }
    me.setOptions({
      [type]: color,
    });
    this.text.color = color;
    this.text.sync();
  }

  // 改变文字属性
  updateAttribute({ value, type }: { value: number, type: string }) {
    const me = this;
    if (!this.text) { return; }
    me.setOptions({
      [type]: value,
    });
    this.text[type] = value;
    this.text.sync();
    Utils.Render.executeAfterFrames(this.updateOutLine.bind(me), 2);
    super.updateAttribute({ value, type });
  }

  active() {
    this.addOutLine();
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
    const { x, z, y } = position;
    return {
      type: 'text',
      key: me.key,
      options: {
        ...me.options,
        x,
        z,
        y,
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