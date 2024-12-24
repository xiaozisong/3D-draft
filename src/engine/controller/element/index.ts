import { Element3D, ElementData } from "@/engine/interface";
import { Render } from "@/engine/render";
import * as THREE from "three";
import { Area, AreaOptions } from "./area";
import { Cube, CubeOptions } from "./cube";
import { Cylinder, CylinderOptions } from "./cylinder";
import { Icon, IconOptions } from "./icon";
import { Text, TextOptions } from "./text";
import { Line, LineOptions } from "./line";
import { Point } from "./point";
import { TOP_COLOR } from "@/engine/constant";
import { Store } from '@/components/store';

export class Elements extends THREE.Group {

  initialData = {
    elementListHash: '1',
  }

  store = new Store(this.initialData);

  // 元素集合
  elementMap: Map<string, Element3D> = new Map();

  constructor(private engine: Render) {
    super();
  }

  getElementByKey(key: string) {
    return this.elementMap.get(key);
  }

  // 获取物体列表
  getElementList() {
    return Array.from(this.elementMap.values());
  }

  getElementListData() {
    return Array.from(this.elementMap.values().map(element => element.getData()));
  }

  // 新增元素
  createElement(key: string) {
    const centerPoint = this.engine.pickController?.getViewportCenterPoint();
    if (!centerPoint) { return }

    const { x, y, z } = centerPoint;
    let data = { type: key, options: { x, y, z } } as ElementData;
    switch (key) {
      case "line":
        data.options = {
          name: '折线',
          ...data.options,
          points: [0, 0, 0, 0, 0, 2.1, 2.2, 0, 3.3],
        };
        break;
      case "cube":
        data.options = {
          name: '立方体',
          ...data.options,
          length: 1,
          width: 1,
          height: 0.5,
          color: TOP_COLOR
        }
        break;
      case "cylinder":
        data.options = {
          name: '棱柱体',
          ...data.options,
        }
        break;
      case "text":
        data.options = {
          name: '文字',
          ...data.options,
          text: "Default Text",
          color: "#000000",
          fontSize: 0.3,
          fontWeight: "bold",
          lineHeight: 1.5,
        };
        break;
      case "area":
        data.options = {
          name: '平面',
          ...data.options,
          width: 3,
          length: 3,
          height: 0.001,
          color: "#E6E7E8",
          opacity: 0.5,
        };
        break;
      case "icon":
        data.options = {
          name: '图标',
          ...data.options,
          size: 1,
          color: "#000000",
        };
        break;
    }
    this.addElement(data);
    this.refreshElementList();
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
    if (target) {
      this.remove(target);
      target?.destroy();
      this.elementMap.delete(elementKey);
    }
    this.refreshElementList();
  }

  // 移除选中元素
  deleteSelectedElement() {
    const activeElement = this.engine.controller.action.select.activeElement;
    if (activeElement) { this.deleteElement(activeElement); }
  }

  // 移除选中元素
  deleteElement(element: Element3D) {
    const selectedElement = this.engine.controller.action.select.activeElement;
    // 删除时前置处理
    if (element instanceof Point) {
      this.engine.controller.action.line.removeLinePoint(element);
    }

    if (element instanceof Line) {
      this.engine.controller.action.line.removeLineLink(element);
    }

    if (element instanceof Text) {
      this.engine.controller.action.text.removeTextLink(element);
    }

    // 执行删除
    if (element) {
      this.engine.controller.action.text.clearLinkText(element);
      this.removeElement(element.key);
      this.engine.controller.action.select.cancelSelectObject();
      this.engine.controller.setting.updateEditBar();
    }
  }

  // 移除选中元素
  deleteElementByKey(key: string) {
    const element = this.getElementByKey(key);
    if (element) { this.deleteElement(element); }
  }

  // 获取数据
  getData() {
    return Array.from(this.elementMap.values()).map(element => {
      const itemData = element.getData();
      return itemData;
    });
  }

  // 清除数据
  clearData() {
    this.elementMap.forEach(element => {
      this.remove(element);
      element.destroy();
    });
    this.elementMap.clear();
    this.refreshElementList();
  }

  // 刷新元素列表
  refreshElementList() {
    const me = this;
    me.engine.controller.element.store.setState({
      elementListHash: Date.now().toString(),
    })
  }

  destroy() {

  }

}