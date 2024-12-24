import * as THREE from "three";
import { Render } from "./render";
import { Utils } from "./utils";
import { Element3D } from "./interface";
import { Line } from "./controller/element/line";

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

    if (!this.engine.sceneController.plane) {
      return intersectionPoint
    }
    this.raycaster.setFromCamera(this.centerVector2, camera);
    // 找到射线和平面的交点
    this.raycaster.ray.intersectPlane(this.engine.sceneController.plane, intersectionPoint);
    const x = Utils.Math.resolveZero(intersectionPoint.x);
    const y = Utils.Math.resolveZero(intersectionPoint.y);
    const z = Utils.Math.resolveZero(intersectionPoint.z);
    intersectionPoint.set(x, y, z)
    return intersectionPoint
  }

  // 拾取物体返回交集数组
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
    const result = allIntersects.filter(item => {
      if (item.object instanceof THREE.GridHelper || item.object.name === 'plane') {
        return false;
      }
      return true;
    })
    return result;
  }

  // 拾取物体并返回Mesh
  pickToMesh(event: MouseEvent) {
    const me = this;
    const allIntersects = me?.pick(event);
    const mesh = allIntersects[0]?.object;
    const point = allIntersects[0]?.point;
    return { mesh, point };
  }

  // 拾取物体并返回Element
  pickToElement(event: MouseEvent) {
    const me = this;
    const { mesh, point } = me.pickToMesh(event);
    const element = Utils.lookUpElement(mesh);
    return { element, point };
  }

  // 拾取物体并返回可点击的Element
  pickToPickableElement(event: MouseEvent) {
    const me = this;
    const { element, point } = me.pickToElement(event);
    if (element?.pickable) {
      return { element, point };
    }
    return { element: null, point };
  }

  // 拾取物体并返回交点
  pickToPoint(event: MouseEvent, target?: THREE.Object3D): THREE.Vector3 | null {
    const intersects = this.pick(event, target);
    if (intersects.length > 0) {
      return intersects[0].point;
    }
    return null;
  }

  // 优先拾取物体，拾取不到物体则拾取平面，排除exclude
  pickToPointFromElementOrPlane(event: MouseEvent, excludes: THREE.Object3D<THREE.Object3DEventMap>[]): {
    point: THREE.Vector3, isPlane: boolean
  } {
    const me = this;
    let targetElement: Element3D | null = null;
    let point: THREE.Vector3 | null = null;
    const allIntersects = me.pick(event);
    for (let i = 0; i < allIntersects.length; i++) {
      const intersect = allIntersects[i];
      const mesh = intersect.object;
      const element = Utils.lookUpElement(mesh);
      if (element && !excludes.includes(element as THREE.Object3D) && !(element instanceof Line)) {
        targetElement = element;
        point = intersect.point;
        break;
      }
    }
    if (targetElement && point) {
      return { point, isPlane: false };
    }
    return { point: this.intersectPlane(event), isPlane: true };
  }
}
