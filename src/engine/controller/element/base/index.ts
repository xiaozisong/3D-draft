import { Render } from "@/engine/render";
import { nanoid } from "nanoid";
import * as THREE from "three";
import { COLOR_SET } from "@/engine/constant/color";
export interface IBase3DObject extends THREE.Group {
  key: string;
  isElement: boolean;
}

export class Base3DObject extends THREE.Group {
  // 元素标记
  isElement: boolean = true;
  // 元素唯一标识
  key: string;
  // 默认边框颜色
  defaultOutlineColor = COLOR_SET.defaultColor;
  // 选中边框颜色
  activeOutlineColor = COLOR_SET.activeColor;
  
  constructor(public engine: Render) {
    super();
    this.key = nanoid()

  }

  destroy() {
    this.parent?.remove(this)
  }

}