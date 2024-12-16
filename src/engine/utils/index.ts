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

  // 销毁group
  static disposeGroup(group: THREE.Group<Object3DEventMap>) {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);

       // 递归销毁子元素的几何体和材质
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      }

      // 如果子对象也有子对象，也需要递归处理
      if (child instanceof THREE.Group) {
        Utils.disposeGroup(child);
      }
    }
    group.parent?.remove(group);
  }

  // 找出最近的网格关键点
  static findNearestPoint(position: THREE.Vector3, gridPoints: THREE.Vector3[]): THREE.Vector3 {
    var closestPoint = gridPoints[0];
    var closestDistance = position.distanceTo(closestPoint);

    for (var i = 1; i < gridPoints.length; i++) {
      var distance = position.distanceTo(gridPoints[i]);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPoint = gridPoints[i]
      }
    }

    return closestPoint;
  }

}


