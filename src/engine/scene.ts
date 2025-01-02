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

  // 网格磁吸点
  gridPoints: THREE.Vector3[] = [];

  // 地面
  plane?: THREE.Plane;

  // 地面几何体厚度
  thickness = 0.1;

  // 地面几何体
  ground?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial[], THREE.Object3DEventMap>;

  gridHelper1?: THREE.GridHelper;

  gridHelper2?: THREE.GridHelper;

  constructor(private engine: Render) {
    // this.scene.background = new THREE.Color(0x000000);

    this.addGridHelper();
    this.addGround();
    this.addControls();
    // this.initAxesHelper();
    this.initLight();
  }

  // 初始化坐标轴
  initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(2);
    this.scene.add(axesHelper);
  }

  // 初始化地面
  addGround() {
    var width = 16;
    var height = 16;

    var material = [
      new THREE.MeshBasicMaterial({ color: SIDE_DARK_COLOR }), // 前面
      new THREE.MeshBasicMaterial({ color: SIDE_DARK_COLOR }), // 后面
      new THREE.MeshBasicMaterial({ color: 0xffffff }), // 底面
      new THREE.MeshBasicMaterial({ color: SIDE_LIGHT_COLOR }), // 左面
      new THREE.MeshBasicMaterial({ color: 0xffffff }), // 顶面
      new THREE.MeshBasicMaterial({ color: 0xffffff }), // 右面
    ];

    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, this.thickness),
      // new THREE.MeshPhongMaterial({
      //   color: 0x999999,
      // })
      material
    );
    ground.name = "plane"
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.06
    ground.userData.isGround = true;
    this.ground = ground;
    var planeFace = new THREE.Plane(new THREE.Vector3(0, 1, 0));
    // this.ground = planeFace;
    this.plane = planeFace;
    this.scene.add(ground);
  }

  // 更新地面
  updateGround(gridSize: number) {
    const me = this;
    if (!me.ground) { return; }
    const new_geometry = new THREE.BoxGeometry(gridSize, gridSize, me.thickness);
    me.ground.geometry.dispose();
    me.ground.geometry = new_geometry;
    me.ground.geometry.translate(0, me.thickness / 2, 0);
    me.updateGridHelper();
  }

  // 初始化网格帮助器
  addGridHelper() {
    const me = this;
    // 尺寸
    const size = me.engine.controller?.setting?.store?.getState()?.gridSize || 16;
    // 间隔
    const gap = 1;
    // 吸附点细分
    const seg = 4;
    const gridSize = size * seg;
    const gridSpacing = gap / seg;
    const gridPoints = [];

    const grid1Color = 0xEEEEEE;
    const grid2Color = 0xbbbbbb;
    // 第一个grid是下面的灰色网格
    me.gridHelper1 = new THREE.GridHelper(size, size * 2, grid1Color, grid1Color);
    this.scene.add(me.gridHelper1);

    me.gridHelper1.position.y = -0.008;
    // 第二个是上面的黑色网格
    me.gridHelper2 = new THREE.GridHelper(size, size, grid2Color, grid2Color);
    this.scene.add(me.gridHelper2);

    for (let i = -gridSize / 2; i <= gridSize / 2; i++) {
      for (let j = -gridSize / 2; j <= gridSize / 2; j++) {
        gridPoints.push(new THREE.Vector3(i * gridSpacing, 0, j * gridSpacing));
      }
    }
    me.gridPoints = gridPoints;

  }

  // 更新网格帮助器
  updateGridHelper() {
    const me = this;
    if (!me.gridHelper1 || !me.gridHelper2) { return; }

    me.scene.remove(me.gridHelper1);
    me.scene.remove(me.gridHelper2);
    me.gridHelper1.geometry.dispose();
    me.gridHelper2.geometry.dispose();

    me.addGridHelper();
  }

  // 初始化光
  initLight() {
    const scene = this.scene;

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 环境光，颜色和强度
    scene.add(ambientLight);

    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 方向光，颜色和强度
    directionalLight.position.set(5, 10, 7.5); // 设置方向光的位置
    scene.add(directionalLight);

    // 添加点光
    const pointLight = new THREE.PointLight(0xffffff, 1); // 点光，颜色和强度
    pointLight.position.set(-50, 50, -50); // 设置点光的位置
    scene.add(pointLight);

    // 添加半球光
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xcccccc, 1); // 半球光，天空颜色，地面颜色和强度
    hemisphereLight.position.set(0, 20, 0); // 设置半球光位置
    scene.add(hemisphereLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, 10);
    scene.add(spotLight);
  }

  // 初始化轨道控制器
  addControls() {
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
      this.engine.controller.setting.updateEditBar();
    });


    this.engine.registerUpdate("updateControls", () => {
      this.controls?.update();
    });
    // this.controls.maxPolarAngle = Math.PI / 2.5;
  }

}
