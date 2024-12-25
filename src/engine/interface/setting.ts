import { Vector2 } from "three";

export interface SettingStore {
  // 选中的元素
  activeElementKeys: string[];
  // 编辑条屏幕位置
  editbarPosition: { x: number, y: number };
  // 编辑条是否显示
  editbarVisible: boolean;
  // 网格大小
  gridSize: number;
  // 相机类型
  cameraType: string;
  // 轴侧展示
  isIsometricView: boolean;
}