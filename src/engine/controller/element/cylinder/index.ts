import * as THREE from "three";
import { RenderPass, EffectComposer, OutlinePass, LineMaterial, LineGeometry, Line2 } from "three/addons";
import { Render } from "@/engine/render";
import { Base3DObject } from "../base";
import { Utils } from "@/engine/utils";
import { nanoid } from 'nanoid';
import { SIDE_LIGHT_COLOR, TOP_COLOR } from "@/engine/constant";
import { BaseOptions } from "@/engine/interface";

export interface CylinderOptions extends BaseOptions {
  x: number,
  z: number
}

export class Cylinder extends Base3DObject<CylinderOptions> {
  groundGap = 0.01;
  lineWdith = 0.02;
  lineWdithActive = 0.03;

  cylinder?: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial[], THREE.Object3DEventMap>

  matLine?: LineMaterial = new LineMaterial({
    color: this.defaultOutlineColor,
    linewidth: this.lineWdith,
    worldUnits: true,
    dashed: false,
    alphaToCoverage: true,
    vertexColors: false,
  });

  constructor(engine: Render, options: CylinderOptions) {
    super(engine, options);
    this.init();
  }

  init() {
    const me = this;



    // const length = 1;
    // const width = 1;
    // const height = 0.5;
    // const geometry = new THREE.BoxGeometry(length, height, width);

    // 创建圆柱体几何体
    const radiusTop = 0.538; // 顶部半径
    const radiusBottom = 0.538; // 底部半径
    const height = 0.5; // 高度
    const radialSegments = 8 // 分段数，决定棱柱的边数
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);


    var material = [
      new THREE.MeshBasicMaterial({ color: SIDE_LIGHT_COLOR }), // 侧面
      new THREE.MeshBasicMaterial({ color: TOP_COLOR }), // 顶面
      new THREE.MeshBasicMaterial({ color: 'blue' }), // 顶面
      new THREE.MeshBasicMaterial({ color: 'darkblue' }), // 底面
      new THREE.MeshBasicMaterial({ color: 'green' }), // 左面
      new THREE.MeshBasicMaterial({ color: 'yellow' }), // 右面
    ];

    // var material = new THREE.MeshBasicMaterial({
    //   color: 0xedebe9,
    //   map: new THREE.CanvasTexture(this.getTextCanvas({text:'T2',width:200,height:200})),
    // }); // 白色材质
    const textTexture = new THREE.CanvasTexture(
      Utils.getTextCanvas({ text: "T2", width: 1000, height: 1000 })
    );

    material[2] = new THREE.MeshBasicMaterial({ map: textTexture }); // 将纹理应用到前面

    const cylinder = new THREE.Mesh(geometry, material);

    geometry.translate(0, height / 2, 0);

    this.position.x = me.options.x;
    this.position.z = me.options.z;

    this.rotateY(180 / radialSegments * Math.PI / 180); // 绕y轴旋转45度

    var edges = new THREE.EdgesGeometry(geometry);
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 20 });

    var lines = new THREE.LineSegments(edges, lineMaterial);
    lines.userData.pickable = false;

    cylinder.add(lines);

    me.cylinder = cylinder;
    cylinder.userData.pickable = true;
    cylinder.userData.key = this.key;

    this.addLine2();
    me.add(cylinder);
    this.position.y = this.groundGap
  }

  addLine2() {
    const me = this;
    const mesh = me.cylinder;
    if (!mesh) { return }
    const geometry = mesh.geometry;
    const position = mesh.position;

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
      type: 'cylinder',
      key: me.key,
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
    me.cylinder = undefined;
    me.matLine = undefined;
    super.destroy();
  }

}