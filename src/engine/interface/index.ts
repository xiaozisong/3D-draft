import { Area, AreaOptions } from "../controller/element/area";
import { Cube, CubeOptions } from "../controller/element/cube";
import { Cylinder, CylinderOptions } from "../controller/element/cylinder";
import { Icon, IconOptions } from "../controller/element/icon";
import { Text, TextOptions } from "../controller/element/text";
import { Line, LineOptions } from "../controller/element/line";
import { Point, PointOptions } from "../controller/element/point";


export interface BaseOptions {
  key?: string,
  x?: number,
  z?: number,
  y?: number,
  linkLineKeys?: string[],
  linkTextKey?: string,
}

export type Element3D = Cube | Cylinder | Text | Area | Icon | Line | Point

export interface ElementData {
  key?: string,
  type: string,
  options: CubeOptions | CylinderOptions | TextOptions | AreaOptions | IconOptions | LineOptions | PointOptions,
}

export enum LineActionStatus {
  // 空闲状态
  idle,
  add,
  remove,
  move,
  // 正在添加状态
  create,
  // 删除点模式
  removePoint,
  // 新增点模式
  addPoint,
}