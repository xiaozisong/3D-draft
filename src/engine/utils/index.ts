import { Mesh, Object3D, Object3DEventMap } from "three";
import { TOP_COLOR } from "../constant";
import { Element3D } from "../interface";
import * as THREE from "three";
import { Math } from './math'
export interface MeshElement extends Mesh {
  isElement: boolean;
  parent: MeshElement;
}

export class Utils {

  // 数学工具类
  static Math = Math;

  // 生成文字canvas
  static getTextCanvas({ text, height, width }: { text: string, height: number, width: number }) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = TOP_COLOR;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'destination-out';

      // 填充一个矩形背景
      ctx.fillStyle = '#333'; // 画布背景颜色

      ctx.font = height / 2 + 'px " bold';
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2);
    }
    return canvas;
  }

  // 从mesh向上查找元素
  static lookUpElement(_mesh: Object3D<Object3DEventMap>): Element3D | undefined {
    const mesh = _mesh as MeshElement
    if (!mesh) { return }
    if (mesh?.['isElement']) {
      return mesh as unknown as Element3D
    }
    return Utils.lookUpElement(mesh?.parent)
  }

  // 函数来计算 Group 的尺寸
  static getGroupSize(group: THREE.Group) {
    const box = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    box.getSize(size);
    return size;
  }

  // 计算group的边界 (全局坐标系)
  static getBoundingBox(group: THREE.Group) {
    // 创建一个空的边界框
    const boundingBox = new THREE.Box3();
    // 计算 Group 对象的边界框
    group.traverse((object) => {
      if (object?.type === 'Mesh') {
        boundingBox.expandByObject(object);
      }
    });
    return boundingBox
  }


}


