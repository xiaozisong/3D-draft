import { Render } from "@/engine/render";
import { BaseOptions } from "@/engine/interface";
import { Base3DObject } from "../base";
import { TOP_COLOR } from "@/engine/constant";
import { Utils } from "@/engine/utils";

export class Unit3DObject<OptionsType extends BaseOptions> extends Base3DObject<OptionsType> {

  constructor(public engine: Render, public options: OptionsType) {
    super(engine, options);
  }

  // 改变名称
  changeName({ value, type }: { value: string, type: string }) {
    const me = this;
    const newOptions = {
      [type]: value,
    } as Partial<OptionsType>;
    me.setOptions(newOptions);
    me.engine.controller.element.refreshElementList();
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

  // 设置离地高度
  setPositionY({ value, type }: { value: number, type: string }) {
    this.options.y = value
    this.position.y = value
  }
  // 同步位置数据到options 
  syncPosition(){
    this.options.x = this.position.x
    this.options.y = this.position.y
    this.options.z = this.position.z
  }

  destroy(): void {
    super.destroy();
  }
}