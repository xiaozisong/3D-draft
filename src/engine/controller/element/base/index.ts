import { Render } from "@/engine/render";
import { nanoid } from "nanoid";
import * as THREE from "three";
import { COLOR_SET } from "@/engine/constant/color";
import { Utils } from "@/engine/utils";
export interface IBase3DObject extends THREE.Group {
  key: string;
  isElement: boolean;
}

export class Base3DObject<OptionsType> extends THREE.Group {
  // 元素标记
  isElement: boolean = true;
  // 元素唯一标识
  key: string;
  // 默认边框颜色
  defaultOutlineColor = COLOR_SET.defaultColor;
  // 选中边框颜色
  activeOutlineColor = COLOR_SET.activeColor;
  
  constructor(public engine: Render, public options: OptionsType) {
    super();
    this.key = nanoid()

  }

  getOptions() {
    return this.options;
  }

  setOptions(options: Partial<OptionsType>) {
    this.options = {
      ...this.options,
      ...options,
    }
  }

  destroy() {
    Utils.disposeGroup(this);
  }

}