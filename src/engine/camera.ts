import { Render } from "./render";
import * as THREE from "three";

export class Camera {
  // 当前相机实例
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;

  // 正交相机
  orthographicCamera: THREE.OrthographicCamera;

  // 透视相机
  perspectiveCamera: THREE.PerspectiveCamera;

  // 是否为轴测视图
  isIsometricView: boolean = true;

  constructor(private engine: Render) {
    this.perspectiveCamera = this.initPerspectiveCamera();
    this.orthographicCamera = this.initOrthographicCamera();
    this.camera = this.orthographicCamera;
  }

  // 初始化正交相机
  initOrthographicCamera() {
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
    return camera;
  }

  // 初始化透视相机
  initPerspectiveCamera() {
    const rect = this.engine.domContainer?.getBoundingClientRect();
    const domContainerWidth = rect?.width;
    const domContainerHeight = rect?.height;

    const width = domContainerWidth || this.engine.width;
    const height = domContainerHeight || this.engine.height;

    const perspectiveCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    perspectiveCamera.position.set(7, 10, 7);
    return perspectiveCamera;
  }

  // 更新相机
  updateCamera() {
    if (this.camera instanceof THREE.OrthographicCamera) {
      this.updateOrthographCamera();
    }
  }

  // 更新正交相机
  updateOrthographCamera() {
    const width = this.engine.width
    const height = this.engine.height
    const camera = this.engine.cameraController.camera;
    if (camera instanceof THREE.OrthographicCamera) {
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
  toogleIsometricView(isIsometricView: boolean) {
    if (!this.camera) { return }
    this.isIsometricView = isIsometricView;
    this.engine.sceneController.controls?.reset();
    if (isIsometricView) {
      this.camera.position.set(10, 10, 10);
    } else {
      this?.camera.position.set(0, 10, 0);
    }
    this?.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.engine.controller.setting.store.setState({
      isIsometricView
    })
  }

  // 切换正交相机或者透视相机
  toogleCamera(isPerspectiveCamera: boolean) {
    const scene = this.engine.sceneController.scene;
    const controls = this.engine.sceneController.controls;
    if (!controls) { return; }
    if (!isPerspectiveCamera) {
      // 正交
      scene.remove(this.perspectiveCamera);
      scene.add(this.orthographicCamera);
      controls.object = this.orthographicCamera;
      this.camera = this.orthographicCamera;
      controls.enableRotate = false;
      controls.autoRotate = false;
      controls.minPolarAngle = -Math.PI / 2 - 0.1;
      controls.maxPolarAngle = Math.PI / 2 - 0.1;
    } else {
      // 透视
      scene.remove(this.orthographicCamera);
      scene.add(this.perspectiveCamera);
      controls.object = this.perspectiveCamera;
      this.camera = this.perspectiveCamera;
      controls.enableRotate = true;
      controls.autoRotate = true;
      controls.minPolarAngle = -Math.PI / 2 - 0.1;
      controls.maxPolarAngle = Math.PI / 2 - 0.1;
    }
    this.updateCamera();

    this.engine.controller.setting.store.setState({
      cameraType: isPerspectiveCamera ? 'perspectiveCamera' : 'orthographicCamera'
    });
  }

}