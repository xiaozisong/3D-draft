// 极简demo,调试用
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GPUStatsPanel } from 'three/addons/utils/GPUStatsPanel.js';
import { SVGLoader } from 'three/addons';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let line, renderer, scene, camera, camera2, controls;
let line1;
let matLine, matLineBasic, matLineDashed;
let stats, gpuPanel;
let gui;

// viewport
let insetWidth;
let insetHeight;

export function init() {

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xedebe9);
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(10, 10, 10);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 10;
  controls.maxDistance = 500;

  addElement({ scene, renderer, camera })


  window.addEventListener('resize', onWindowResize);
  onWindowResize();

  stats = new Stats();
  document.body.appendChild(stats.dom);

  gpuPanel = new GPUStatsPanel(renderer.getContext());
  stats.addPanel(gpuPanel);
  stats.showPanel(0);
  initGridHelper()

}

function initGridHelper() {
  const gridHelper = new THREE.GridHelper(16, 16, 0x54626F, 0x54626F);
  scene.add(gridHelper);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  insetWidth = window.innerHeight / 4; // square
  insetHeight = window.innerHeight / 4;
}

export function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  stats.update();
}


function addElement({ scene, renderer, camera }) {
  const loader = new SVGLoader();
  loader.load('user.svg', function (data) {
    const paths = data.paths;

    const group = new THREE.Group();
    group.scale.multiplyScalar(0.01);

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const material = new THREE.MeshBasicMaterial({
        color: path.color,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const shapes = path.toShapes(true);
      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        const geometry = new THREE.ShapeGeometry(shape);
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
      }
    }

    scene.add(group);

  });
}