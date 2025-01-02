import { Render } from "@/engine/render";
import { nanoid } from "nanoid";
import * as THREE from "three";
import { COLOR_SET } from "@/engine/constant/color";
import { Utils } from "@/engine/utils";
import { BaseOptions } from "@/engine/interface";
import { Color } from "antd/es/color-picker";
export interface IBase3DObject extends THREE.Group {
  key: string;
  isElement: boolean;
}

export abstract class Base3DObject<OptionsType extends BaseOptions> extends THREE.Group {
  // 元素标记
  isElement: boolean = true;
  // 元素唯一标识
  key: string;
  // 默认边框颜色
  defaultOutlineColor = COLOR_SET.defaultColor;
  // 选中边框颜色
  activeOutlineColor = COLOR_SET.activeColor;
  // 是否可选中
  pickable: boolean = true;
  // 是否可拖拽
  dragable: boolean = true;
  
  constructor(public engine: Render, public options: OptionsType) {
    super();
    this.key = options.key || nanoid();
  }

  // 更新颜色
  abstract updateColor(options: { value: Color, type: string }): void

  // 更新尺寸
  abstract updateSize(options: { value: number, type: string }): void

  // 更新透明度
  abstract updateOpacity(options: { value: number, type: string }): void

  // 更新深度
  abstract updateDepth(options: { value: number, type: string }): void

  // 更新类型
  abstract updateType(options: { value: string, type: string }): void

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