import { Render } from "@/engine/render";
import { BaseOptions } from "@/engine/interface";
import { Base3DObject } from "../base";

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

  destroy(): void {
    super.destroy();
  }
}