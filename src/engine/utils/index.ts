import { Mesh, Object3D, Object3DEventMap } from "three";
import { TOP_COLOR } from "../constant";
import { Element3D } from "../interface";
import * as THREE from "three";
import { Math } from './math'
import { get } from "lodash";
import { Color } from "./color";
import { Render } from "./render";
import { Dom } from "./dom";
import ClipboardManager from "./clipboard";
export interface MeshElement extends Mesh {
  isElement: boolean;
  parent: MeshElement;
}

export class Utils {

  // 数学工具类
  static Math = Math;

  // 颜色工具类
  static Color = Color;

  // 渲染工具类
  static Render = Render;

  // dom工具类
  static Dom = Dom;

  // 剪贴板工具类
  static clipboard = ClipboardManager;

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

  /**
   * 通过线段和目标对象，计算交点
   * 
   * @static
   * @param {{
   *      endPoint: THREE.Vector3,
   *      startPoint: THREE.Vector3,
   *      target: THREE.Object3D,
   * }} {
   *      endPoint,
   *      startPoint,
   *      target
   * }
   * @returns {( THREE.Vector3 | null )}
   * 
   * @memberOf Utils
   */
  static getIntersectPointBySegment1({
    endPoint,
    startPoint,
    target,
  }: {
    endPoint: THREE.Vector3,
    startPoint: THREE.Vector3,
    target: Element3D,
  }): THREE.Vector3  | null {
    // 计算线段方向和长度
    const direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize();
    const distance = startPoint.distanceTo(endPoint);
    // 使用Raycaster 检测交点
    const raycaster = new THREE.Raycaster(startPoint, direction, 0, distance);
    const intersects = raycaster.intersectObject(target);
    if (intersects.length > 0) {
      const intersectPoint = intersects[0].point;
      return intersectPoint;
    }
    return null;
  }

  static getIntersectPointBySegment({
    endPoint,
    startPoint,
    target,
  }: {
    endPoint: THREE.Vector3,
    startPoint: THREE.Vector3,
    target: Element3D,
  }) {
    // 创建射线
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize();
    const length = startPoint.distanceTo(endPoint);

    // 设置射线起点和方向
    raycaster.set(startPoint, direction);
    raycaster.far = length;

    // 检测交点
    const intersects = raycaster.intersectObject(target);
    if (intersects.length > 0) {
      const intersectPoint = intersects[0].point;
      return intersectPoint;
    }
    return null;
  }

  /**
   * 从场景中找物体
   * 
   * @static
   * @param {{
   *  key: string,
   *  scene: THREE.Scene,
   * }} {
   *  key,
   *  scene
   * }
   * @returns
   * 
   * @memberOf Utils
   */
  static getObjectByKey({
    key,
    scene
  }: {
    key: string,
    scene: THREE.Scene,
  }): THREE.Object3D | null {
    var foundObject = null;
    scene.traverse(function (object) {
      if (get(object, 'key') === key) {
        foundObject = object;
      }
    });
    return foundObject;
  }
}