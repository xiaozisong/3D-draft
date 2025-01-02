import { Render } from "@/engine/render";
import { BaseOptions } from "@/engine/interface";
import { Base3DObject } from "../base";
import { TOP_COLOR } from "@/engine/constant";
import { Utils } from "@/engine/utils";
import { Color } from "antd/es/color-picker";

export abstract class Unit3DObject<OptionsType extends BaseOptions> extends Base3DObject<OptionsType> {

  constructor(public engine: Render, public options: OptionsType) {
    super(engine, options);
  }

  // 生成面的颜色
  getColor() {
    const color = this.options.color || TOP_COLOR;
    const topColor = color;
    const sideColorZ = Utils.Color.darkenColor(color, 10);
    const sideColorX = Utils.Color.darkenColor(color, 11);
    const otherColor = Utils.Color.darkenColor(color, 12);
    return { topColor, sideColorX, sideColorZ, otherColor };
  }

  // 同步位置数据到options
  syncPosition() {
    this.options.x = this.position.x;
    this.options.y = this.position.y;
    this.options.z = this.position.z;
  }

  // 改变名称
  updateName({ value, type }: { value: string, type: string }) {
    const me = this;
    const newOptions = {
      [type]: value,
    } as Partial<OptionsType>;
    me.setOptions(newOptions);
    me.engine.controller.element.refreshElementList();
  }

  // 设置离地高度
  updatePosition({ value, type }: { value: number, type: 'x' | 'y' | 'z' }) {
    this.options[type] = value;
    this.position[type] = value;
  }

  updateColor({ value, type }: { value: Color; type: string; }): void {
  }
  updateSize({ value, type }: { value: number; type: string; }): void {
    console.log('updateSize1')
  }
  // 更新不透明度
  updateOpacity({ value, type }: { value: number; type: string; }): void {
  }
  // 更新厚度
  updateDepth({ value, type }: { value: number, type: string }) {
  }
  // 更新类型
  updateType({ value, type }: { value: string, type: string }) {
  }

  // 更新属性
  updateAttribute({ value, type }: { value: any, type: string }) {
    switch (type) {
      case 'name':
        this.updateName({ value, type })
        break;
      case 'color':
        this.updateColor({ value, type })
        break;
      case 'height':
      case 'length':
      case 'width':
        this.updateSize({ value, type })
        break;
      case 'x':
      case 'y':
      case 'z':
        this.updatePosition({ value, type })
        break;
      case 'opacity':
        this.updateOpacity({ value, type })
        break;
      case 'depth':
        this.updateDepth({ value, type })
        break;
      case 'type':
        this.updateType({ value, type })
        break;
      default:
        break;
    }
  }

  destroy(): void {
    super.destroy();
  }
}