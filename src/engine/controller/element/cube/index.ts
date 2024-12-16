import * as THREE from "three";
import { RenderPass, EffectComposer, OutlinePass, Line2, LineMaterial, LineGeometry } from "three/addons";
import { Render } from "@/engine/render";
import { Base3DObject } from "../base";
import { Utils } from "@/engine/utils";
import { nanoid } from 'nanoid';
import { SIDE_DARK_COLOR, SIDE_LIGHT_COLOR, TOP_COLOR } from "@/engine/constant";
import { BaseOptions } from "@/engine/interface";

export interface CubeOptions extends BaseOptions {
  x: number,
  z: number
}


export class Cube extends Base3DObject<CubeOptions> {
  groundGap = 0.01;

  lineWdith = 0.02;
  lineWdithActive = 0.03;

  cube?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial[], THREE.Object3DEventMap>

  matLineOptions = {
    color: this.defaultOutlineColor,
    linewidth: this.lineWdith,
    worldUnits: true,
    dashed: false,
    alphaToCoverage: true,
    vertexColors: false,
  }

  matLine?: LineMaterial = new LineMaterial(this.matLineOptions);

  constructor(engine: Render, options: CubeOptions) {
    super(engine, options);
    this.init();
  }

  init() {
    const me = this;
    const length = 1;
    const width = 1;
    const height = 0.5;
    const geometry = new THREE.BoxGeometry(length, height, width);

    var material = [
      new THREE.MeshBasicMaterial({ color: SIDE_DARK_COLOR }), // 前面
      new THREE.MeshBasicMaterial({ color: 'green' }), // 后面
      new THREE.MeshBasicMaterial({ color: TOP_COLOR }), // 顶面
      new THREE.MeshBasicMaterial({ color: 'blue' }), // 底面
      new THREE.MeshBasicMaterial({ color: SIDE_LIGHT_COLOR }), // 左面
      new THREE.MeshBasicMaterial({ color: 'purple' }), // 右面
    ];

    // const textTexture = new THREE.CanvasTexture(
    //   Utils.getTextCanvas({ text: "T2", width: 1000, height: 1000 })
    // );
    // material[2] = new THREE.MeshBasicMaterial({ map: textTexture }); 

    const cube = new THREE.Mesh(geometry, material);
    geometry.translate(0, height / 2, 0);
    this.position.x = me.options.x;
    this.position.z = me.options.z;
    me.cube = cube;

    this.addLine2()
    cube.userData.pickable = true;
    cube.userData.key = this.key;
    me.add(cube);
    this.position.y = this.groundGap
  }

  addLine1() {
    const me = this;
    const cube = me.cube;
    if (!cube) { return }
    const geometry = cube.geometry;
    // 添加线条
    var edges = new THREE.EdgesGeometry(geometry);
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 20 });
    var lines = new THREE.LineSegments(edges, lineMaterial);
    lines.userData.pickable = false;
    cube.add(lines);
  }

  addLine2() {
    const me = this;
    const cube = me.cube;
    if (!cube) { return }
    const geometry = cube.geometry;
    const position = cube.position;

    // 添加线条
    var edges = new THREE.EdgesGeometry(geometry);
    const edgesArray = edges.attributes.position.array;
    const edgesCoordinates = [];
    for (let i = 0; i < edgesArray.length; i += 6) {
      const start = new THREE.Vector3(edgesArray[i], edgesArray[i + 1], edgesArray[i + 2]);
      const end = new THREE.Vector3(edgesArray[i + 3], edgesArray[i + 4], edgesArray[i + 5]);
      edgesCoordinates.push({ start, end });
    }
    for (let i = 0; i < edgesCoordinates.length; i++) {
      const start = edgesCoordinates[i].start;
      const end = edgesCoordinates[i].end;
      // const positions = [
      //   start.x + position.x + 0.01,
      //   start.y + position.y + 0.01,
      //   start.z + position.z + 0.01,
      //   end.x + position.x + 0.01,
      //   end.y + position.y + 0.01,
      //   end.z + position.z + 0.01,
      // ];

      const positions = [
        start.x + position.x,
        start.y + position.y,
        start.z + position.z,
        end.x + position.x,
        end.y + position.y,
        end.z + position.z,
      ];

      const lineGeometry = new LineGeometry();
      lineGeometry.setPositions(positions);
      const line = new Line2(lineGeometry, me.matLine);
      line.computeLineDistances();
      line.scale.set(1.01, 1.01, 1.01);
      this.add(line);
    }
  }

  active() {
    if (this.matLine) {
      this.matLine.linewidth = this.lineWdithActive
      this.matLine.color.set(this.activeOutlineColor)
    }
  }

  disActive() {
    if (this.matLine) {
      this.matLine.linewidth = this.lineWdith;
      this.matLine.color.set(this.defaultOutlineColor)
    }
  }

  getData() {
    const me = this;
    const position = me?.position
    if (!position) return;
    const { x, z } = position;
    return {
      type: 'cube',
      options: {
        ...me.options,
        x,
        z
      }
    }
  }

  destroy() {
    const me = this;
    this.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        child?.parent?.remove(child);
        child.geometry.dispose();
        if (child.material instanceof Array) {
          child.material.forEach(material => {
            material.dispose();
          });
        } else {
          child.material.dispose();
        }
      }
    });
    me.cube = undefined;
    me.matLine = undefined;
    super.destroy();
  }

}