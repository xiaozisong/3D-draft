import * as THREE from "three";
import { Scene } from "./scene";
import { SVGLoader } from "three/addons";
import { Camera } from "./camera";
import { PickController } from "./pick";
import { Controller } from "./controller";
import CommandManager from "./tools/command/CommandManager";
import MoveCommand from "./tools/command/MoveCommand";
import RotateCommand from "./tools/command/RotateCommand";

export class Render {
  // 渲染器 启用抗锯齿 + 允许渲染器的背景色包含 alpha 通道(背景可以设置透明)
  renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  // 时钟
  clock = new THREE.Clock();

  // 动画帧更新函数注册表
  updates: Record<string, Function> = {};

  // 渲染容器
  domContainer?: HTMLDivElement;

  // 是否初始化DOM
  domInited = false;

  // 画布宽度
  width: number = 500;

  // 画布高度
  height: number = 500;

  // SVG加载器
  loader = new SVGLoader();

  // 场景控制器
  sceneController: Scene;

  // 相机控制器
  cameraController: Camera;

  // 选取控制器
  pickController: PickController;

  // 业务控制器
  controller: Controller;

  // 命令管理器
  commandManager: CommandManager = new CommandManager();

  constructor() {
    this.initRenderer();
    this.cameraController = new Camera(this);
    this.sceneController = new Scene(this);
    this.pickController = new PickController(this)
    this.controller = new Controller(this);
    this.animate();
    this.initEvent();
  }

  // 初始化渲染器
  initRenderer() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor('hsl(0,0%,95%)', 1.0)
    // renderer.outputEncoding = THREE.sRGBEncoding;
  }

  // 初始化DOM
  initDom(dom: HTMLDivElement) {
    if (this.domInited) {
      return
    }
    this.domContainer = dom;
    const width = dom.clientWidth;
    const height = dom.clientHeight;
    this.width = width;
    this.height = height;

    this.renderer.setSize(width, height);
    dom.appendChild(this.renderer.domElement);
    this.domInited = true
    this.onWindowResize();
  }

  // 初始化事件
  initEvent() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  // 窗口改变大小
  onWindowResize() {
    const me = this;

    const rect = this.domContainer?.getBoundingClientRect();
    const domContainerWidth = rect?.width || this.width;
    const domContainerHeight = rect?.height || this.height;

    this.width = domContainerWidth;
    this.height = domContainerHeight;

    this.cameraController.updateCamera();
    this.renderer.setSize(domContainerWidth, domContainerHeight);
  }

  // 动画帧
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
    const fns = Object.values(this.updates);
    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i];
      fn(this);
    }
  }

  // 重新渲染
  render() {
    // const delta = this.clock.getDelta();
    // const time = this.clock.getElapsedTime() * 10;
    const camera = this.cameraController.camera;
    if (!camera) {
      return
    }
    this.renderer.render(this.sceneController.scene, camera);
  }

  registerUpdate(key: string, fn: Function) {
    this.updates[key] = fn;
  }

  demo() {
    // 初始化Three.js场景和对象
    const scene = this.sceneController.scene;
    const object = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    scene.add(object);
    const commandManager = this.commandManager
    // 移动对象并记录命令
    const moveCommand = new MoveCommand(object, new THREE.Vector3(10, 0, 0));
    commandManager.executeCommand(moveCommand);
    // 旋转对象并记录命令
    const rotateCommand = new RotateCommand(object, new THREE.Euler(0, Math.PI / 2, 0));
    commandManager.executeCommand(rotateCommand);
  }
}
