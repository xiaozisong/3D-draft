import { Vector2 } from 'three';
import *  as THREE from 'three';


export class Math {
  /**
   * 获取屏幕坐标
   * 
   * @static
   * @param {{
   *     camera: THREE.Camera,
   *     renderer: THREE.WebGLRenderer,
   *     point: number[]
   *   }} {
   *     camera,
   *     renderer,
   *     x,
   *     y,
   *     z
   *   } 
   * @returns 
   * 
   * @memberOf Math
   */
  static getViewportPointByWorldPoint({
    camera,
    renderer,
    point
  }: {
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    point: number[]
  }) {
    // 创建一个三维空间坐标
    var vector = new THREE.Vector3(...point);
    // 将三维空间坐标转换为 NDC
    vector.project(camera);
    // 获取渲染器的尺寸
    var width = renderer.domElement.clientWidth;
    var height = renderer.domElement.clientHeight;
    // 将 NDC 转换为屏幕坐标
    var screenX = (vector.x + 1) / 2 * width;
    var screenY = (-vector.y + 1) / 2 * height;
    return { x: screenX, y: screenY }
  }

  /**
   * 计算点与线的距离
   * 
   * @static
   * @param {THREE.Vector3} point
   * @param {THREE.Vector3} start
   * @param {THREE.Vector3} end
   * @returns
   * 
   * @memberOf Math
   */

  static distanceToSegment(point: THREE.Vector3, start: THREE.Vector3, end: THREE.Vector3) {
    const segmentVector = new THREE.Vector3().subVectors(end, start);
    const pointVector = new THREE.Vector3().subVectors(point, start);
    const segmentLengthSquared = segmentVector.lengthSq();
    const projection = pointVector.dot(segmentVector) / segmentLengthSquared;

    if (projection < 0) {
      return point.distanceTo(start);
    } else if (projection > 1) {
      return point.distanceTo(end);
    } else {
      const projectionPoint = start.clone().add(segmentVector.multiplyScalar(projection));
      return point.distanceTo(projectionPoint);
    }
  }

  /**
   * 处理近似零的数
   * 
   * @static
   * @param {number} value
   * @returns
   * 
   * @memberOf Math
   */
  static resolveZero(value: number) {
    let result = value;
    const EPSILON = 1e-14; // 自定义一个很小的数
    if (window.Math.abs(value) < EPSILON) {
      result = 0;
    }
    return result;
  }
}