import * as THREE from "three";
import { OrbitControls } from "three/addons";
import { SIDE_DARK_COLOR, SIDE_LIGHT_COLOR } from "./constant";
import { Controller } from "./controller";
import { Render } from "./render";

export class Scene {
  // 场景
  scene: THREE.Scene = new THREE.Scene();

  // 轨道控制器
  controls?: OrbitControls;

  // 地面
  plane?: THREE.Plane;

  gridPoints: THREE.Vector3[] = [];

  constructor(private engine: Render) {
    // this.scene.background = new THREE.Color(0x000000);

    this.initGridHelper();
    this.initGround();
    this.initControls();
    // this.initAxesHelper();
    // this.initLight();
  }

  // 初始化坐标轴
  initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(2);
    this.scene.add(axesHelper);
  }

  // 初始化地面
  initGround() {
    var width = 16;
    var height = 16;
    var thickness = 0.1; // 厚度

    var material = [
      new THREE.MeshBasicMaterial({ color: SIDE_DARK_COLOR }), // 前面
      new THREE.MeshBasicMaterial({ color: 'green' }), // 后面
      new THREE.MeshBasicMaterial({ color: 'blue' }), // 底面
      new THREE.MeshBasicMaterial({ color: SIDE_LIGHT_COLOR }), // 左面
      new THREE.MeshBasicMaterial({ color: 0xffffff }), // 顶面
      new THREE.MeshBasicMaterial({ color: 'yellow' }), // 右面
    ];

    const plane = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, thickness),
      // new THREE.MeshPhongMaterial({
      //   color: 0x999999,
      // })
      material
    );
    plane.name = "plane"
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.06
    plane.userData.isGround = true;
    var planeFace = new THREE.Plane(new THREE.Vector3(0, 1, 0));
    // this.ground = planeFace;
    this.plane = planeFace;
    this.scene.add(plane);
  }

  // 初始化网格帮助器
  initGridHelper() {
    const me = this;
    // 尺寸
    const size = 16;
    // 间隔
    const gap = 1;
    // 吸附点细分
    const seg = 4;
    const gridSize = size * seg;
    const gridSpacing = gap / seg;
    const gridPoints = [];

    // 第一个grid是下面的灰色网格
    const gridHelper1 = new THREE.GridHelper(size, size * 2, 0xEEEEEE, 0xEEEEEE);
    this.scene.add(gridHelper1);

    // 第二个是上面的黑色网格
    const gridHelper2 = new THREE.GridHelper(size, size, 0x54626F, 0x54626F);
    this.scene.add(gridHelper2);

    for (let i = -gridSize / 2; i <= gridSize / 2; i++) {
      for (let j = -gridSize / 2; j <= gridSize / 2; j++) {
        gridPoints.push(new THREE.Vector3(i * gridSpacing, 0, j * gridSpacing));
      }
    }
    this.gridPoints = gridPoints;

    const pointsGroup = new THREE.Group();

    for (let i = 0; i < gridPoints.length; i += 1) {
      const x = gridPoints[i].x;
      const y = gridPoints[i].y;
      const z = gridPoints[i].z;
      // 设置球体 大小为0.01
      const geometry = new THREE.SphereGeometry(0.01, 8, 8);
      const material = new THREE.MeshBasicMaterial({ color: '#f00' });
      const point = new THREE.Mesh(geometry, material);
      point.position.set(x, y, z);
      pointsGroup.add(point);
    }

    this.scene.add(pointsGroup);
  }

  // 初始化光
  initLight() {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0000ff, 1);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(300, 300, 300);
    this.scene.add(dirLight);

    // 创建环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // 光的颜色，例如 0x404040
    this.scene.add(ambientLight);
  }

  // 初始化轨道控制器
  initControls() {
    const camera = this.engine.cameraController.camera;
    if (!camera) {
      return;
    }
    this.controls = new OrbitControls(camera, this.engine.renderer.domElement);
    this.controls.enableRotate = false;
    this.controls.enableDamping = true; // 启用惯性效果
    this.controls.dampingFactor = 0.05; // 阻尼惯性参数

    // 初始化控制器状态监听
    this.controls.addEventListener('change', () => {
      this.engine.controller.setting.updateEditBarPosition();
    });


    this.engine.registerUpdate("updateControls", () => {
      this.controls?.update();
    });
    // this.controls.maxPolarAngle = Math.PI / 2.5;
  }



}
