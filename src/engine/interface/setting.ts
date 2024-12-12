import { Vector2 } from "three";

export interface SettingStore {
  // 选中的元素
  activeElementKeys: string[];
  // 
  editbarPosition: { x: number, y: number }
}