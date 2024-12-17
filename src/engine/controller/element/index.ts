import { Element3D, ElementData } from "@/engine/interface";
import { Render } from "@/engine/render";
import * as THREE from "three";
import { Area, AreaOptions } from "./area";
import { Cube, CubeOptions } from "./cube";
import { Cylinder, CylinderOptions } from "./cylinder";
import { Icon, IconOptions } from "./icon";
import { Text, TextOptions } from "./text";
import { Line, LineOptions } from "./line";

export class Elements extends THREE.Group {


  // 元素集合
  elementMap: Map<string, Element3D> = new Map();

  constructor(private engine: Render) {
    super();
  }

  getElementByKey(key: string) {
    return this.elementMap.get(key);
  }

  // 新增元素
  createElement(key: string) {
    const centerPoint = this.engine.pickController?.getViewportCenterPoint();
    if (!centerPoint) { return }
    const { x, z } = centerPoint

    let data = { type: key, options: { x, z } } as ElementData;
    switch (key) {
      case "line":
        data.options = {
          ...data.options,
          points: [0, 0, 0, 0, 0, 2.1, 2.2, 0, 3.3],
        };
        break;
      case "cube":
        break;
      case "cylinder":
        break;
      case "text":
        data.options = {
          ...data.options,
          content: "Default Text 😀😝🤡😳😞😟🦋🐽",
          color: "#000000",
          fontSize: 0.2,
          fontWeight: "bold",
        };
        break;
      case "area":
        data.options = {
          ...data.options,
          width: 3,
          length: 3,
          color: "#E6E7E8",
        };
        break;
      case "icon":
        data.options = {
          ...data.options,
          size: 1,
          color: "#000000",
        };
        break;
    }
    this.addElement(data);
  }

  // 添加元素
  addElement(data: ElementData) {
    const { type, options, key } = data
    let element: any;
    switch (type) {
      case 'cube':
        element = new Cube(this.engine, { ...options, key } as CubeOptions)
        break;
      case 'cylinder':
        element = new Cylinder(this.engine, { ...options, key } as CylinderOptions)
        break;
      case 'text':
        element = new Text(this.engine, { ...options, key } as TextOptions)
        break;
      case 'area':
        element = new Area(this.engine, { ...options, key } as AreaOptions)
        break;
      case 'icon':
        element = new Icon(this.engine, { ...options, key } as IconOptions)
        break;
      case 'line':
        element = new Line(this.engine, { ...options, key } as LineOptions)
        break;
    }
    if (element) {
      this.elementMap.set(element.key, element);
      this.add(element);
      return element;
    }
  }

  // 移除元素
  removeElement(elementKey: string) {
    const target = this.elementMap.get(elementKey);
    console.log('target', target)
    const isLine = target instanceof Line;
    if (target) {
      if (isLine) {
        this.engine.controller.action.line.removeLineLink(target);
      }
      this.remove(target);
      target?.destroy();
      this.elementMap.delete(elementKey);
    }
  }

  // 获取数据
  getData() {
    return Array.from(this.elementMap.values()).map(element => element.getData());
  }

  destroy() {

  }

}