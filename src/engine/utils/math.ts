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
}