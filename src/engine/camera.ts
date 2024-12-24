import { Render } from "./render";
import * as THREE from "three";

export class Camera {
  // 相机实例
  camera: THREE.OrthographicCamera;

  // 是否为轴测视图
  isIsometricView: boolean = true;

  constructor(private engine: Render) {
    const me = this;

    const rect = this.engine.domContainer?.getBoundingClientRect();
    const domContainerWidth = rect?.width
    const domContainerHeight = rect?.height

    const width = domContainerWidth || this.engine.width
    const height = domContainerHeight || this.engine.width

    const aspect = width / height;
    const d = 7;
    // 创建正交相机
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.01, 10000);
    this.camera = camera;
    camera.position.set(100, 100, 100);

    camera.updateProjectionMatrix();

    // camera.rotation.order = "YXZ";
    // camera.rotation.y = -Math.PI / 4;
    // camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
  }

  // 更新相机
  updateCamera() {
    const width = this.engine.width
    const height = this.engine.height
    const camera = this.engine.cameraController.camera;
    if (camera) {
      const aspect = width / height;
      var d = 7;
      camera.left = -d * aspect;
      camera.right = d * aspect;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();
      // camera.rotation.y = -Math.PI / 4;
      // camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
    }
  }

  // 切换相机为顶视图或轴测图
  toogleCamera(isIsometricView: boolean) {
    if (!this.camera) { return }
    this.isIsometricView = isIsometricView;
    this.engine.sceneController.controls?.reset();
    if (isIsometricView) {
      this.camera.position.set(10, 10, 10);
    } else {
      this?.camera.position.set(0, 10, 0);
    }
    this?.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
}