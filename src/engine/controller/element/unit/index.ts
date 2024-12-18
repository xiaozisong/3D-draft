import { Render } from "@/engine/render";
import { nanoid } from "nanoid";
import * as THREE from "three";
import { COLOR_SET } from "@/engine/constant/color";
import { Utils } from "@/engine/utils";
import { BaseOptions } from "@/engine/interface";
import { Base3DObject } from "../base";

export interface IBase3DObject extends THREE.Group {
  key: string;
  isElement: boolean;
}

export class Unit3DObject<OptionsType extends BaseOptions> extends Base3DObject<OptionsType> {
  textLabel?: THREE.Mesh;

  constructor(public engine: Render, public options: OptionsType) {
    super(engine, options);
  }

  destroy(): void {
    super.destroy();
  }
}