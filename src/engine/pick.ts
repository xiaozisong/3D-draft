import * as THREE from "three";
import { Render } from "./render";

export class PickController {
  // 视窗中心位置
  centerVector2 = new THREE.Vector2();

  // 鼠标位置
  mouse = new THREE.Vector2();

  // 射线
  raycaster = new THREE.Raycaster();

  constructor(private engine: Render) {

  }

  // 与平面求交点
  intersectPlane(event: MouseEvent): THREE.Vector3 {
    const camera = this.engine.cameraController.camera
    const intersectionPoint = new THREE.Vector3();
    if (!camera) { return intersectionPoint }
    var rect = this.engine.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, camera);
    if (!this.engine.sceneController.plane) {
      return intersectionPoint
    }
    // 找到射线和平面的交点
    this.raycaster.ray.intersectPlane(this.engine.sceneController.plane, intersectionPoint);
    return intersectionPoint
  }

  // 获取视窗下的三维中心点
  getViewportCenterPoint(): THREE.Vector3 {
    const camera = this.engine.cameraController.camera
    const intersectionPoint = new THREE.Vector3();
    if (!camera) { return intersectionPoint }

    this.raycaster.setFromCamera(this.centerVector2, camera);
    if (!this.engine.sceneController.plane) {
      return intersectionPoint
    }
    // 找到射线和平面的交点
    this.raycaster.ray.intersectPlane(this.engine.sceneController.plane, intersectionPoint);
    return intersectionPoint
  }

  // 拾取物体
  pick(event: MouseEvent, target?: THREE.Object3D) {
    const camera = this.engine.cameraController.camera
    const scene = this.engine.sceneController.scene
    if (!camera) { return [] }
    var rect = this.engine.renderer.domElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, camera);
    let pickTarget: THREE.Object3D | THREE.Object3D[] | undefined = target
    let allIntersects = []
    if (!pickTarget) {
      pickTarget = scene.children
      allIntersects = this.raycaster.intersectObjects(pickTarget, true);
    } else {
      allIntersects = this.raycaster.intersectObject(pickTarget, true);
    }
    return allIntersects || [];
  }
}
