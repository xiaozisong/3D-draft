import { Element3D, LineActionStatus } from "@/engine/interface";
import { Render } from "@/engine/render";
import { MeshElement, Utils } from "@/engine/utils";
import * as THREE from "three";
import { RenderPass, EffectComposer, OutlinePass } from "three/addons";
import { Line } from "../element/line";
import { Point } from "../element/point";

export class Events {
  // 拖拽偏移量
  dragDelta = new THREE.Vector3();

  // 拖拽物体
  dragObject?: Element3D;

  // 当前选中的物体
  _activeObject?: Element3D;

  constructor(private engine: Render) {
    this.initEvents();
  }

  set activeObject(value) {
    this._activeObject = value
    let activeElementKeys = []
    if (value) {
      activeElementKeys.push(value.key)
    } else {
      activeElementKeys = []
    }
    this.engine.controller.setting?.store.setState({
      activeElementKeys,
    })
    this.engine.controller.setting.updateEditBar();
  }

  get activeObject() {
    return this._activeObject;
  }

  // 选中物体
  selectObject(event: MouseEvent) {
    const me = this;
    const allIntersects = me.engine.pickController?.pick(event);
    const allObjects = allIntersects?.filter((item) => item.object.userData.pickable);

    if (allObjects.length > 0) {
      const object = allObjects[0].object;
      const target = Utils.lookUpElement(object)
      if (!target) { return }

      var intersectPoint = me.engine.pickController.intersectPlane(event);
      if (intersectPoint) {
        me.dragDelta.subVectors(intersectPoint, target.position);
      }
      me.dragObject = target;
      me.activeObject?.disActive();
      me.activeObject = target;
      me.activeObject?.active();
    } else {
      me.activeObject?.disActive();
      me.dragObject = undefined;
      me.activeObject = undefined;
    }
  }

  // 显示连线面板
  showLinePanel(event: MouseEvent) {

  }

  // 移动物体
  moveObject(event: MouseEvent) {
    const me = this;
    var intersectPoint = me.engine.pickController.intersectPlane(event);
    if (!intersectPoint || !me.dragObject) { return }
    const tempVetor = new THREE.Vector3(intersectPoint.x - me.dragDelta.x, 0, intersectPoint.z - me.dragDelta.z);
    const targetPoint = Utils.findNearestPoint(tempVetor, this.engine.sceneController.gridPoints);
    if (!(me.dragObject instanceof Line)) {
      me.dragObject.position.x = targetPoint.x;
      me.dragObject.position.y = me.dragObject?.groundGap || 0;
      me.dragObject.position.z = targetPoint.z;
      // 更新关联线
      me.engine.controller.action.line.updateLinkLine(me.dragObject);
      // 更新编辑栏位置
      this.engine.controller.setting.updateEditBar();
      if (me.dragObject instanceof Point) {
        me.engine.controller.action.line.updateLineByPoint(me.dragObject);
      }
    }
  }

  // 鼠标按下
  pointdown(event: MouseEvent) {
    const me = this;
    event.preventDefault();
    // 绘制连线
    if (me.engine.controller.action.line.status === LineActionStatus.add) {
      me.engine.controller.action.line.addingArrowPoint(event);
    } else {
      // 选中物体
      me.selectObject(event);
    }
  }

  // 鼠标移动
  pointerMove(event: MouseEvent) {
    const me = this;
    // 拖拽物体
    if (me.dragObject) {
      me.moveObject(event);
    }
    // 绘制连线
    if (me.engine.controller.action.line.status === LineActionStatus.add) {
      me.engine.controller.action.line.addingArrowMouseMove(event);
    }

  }

  // 鼠标松开
  pointerup() {
    const me = this;
    me.dragObject = undefined;
  }

  // 绑定事件
  initEvents() {
    const me = this
    const domElement = me.engine.renderer.domElement;
    domElement.addEventListener("pointerdown", this.pointdown.bind(this), false);
    domElement.addEventListener("pointermove", this.pointerMove.bind(this), false);
    domElement.addEventListener("pointerup", this.pointerup.bind(this), false);
  }

}



// // 鼠标按下
// pointdown(event: MouseEvent) {
//   const me = this;
//   // const scene = me.engine.sceneController.scene;
//   // const camera = me.engine.cameraController.camera;

//   // const outlinePass = me.engine.controller.post?.outlinePass;
//   // const composer = me.engine.controller.post?.composer;
//   event.preventDefault();
//   if (!me.engine.pickController) { return }

//   const allIntersects = me.engine.pickController?.pick(event);
//   const allObjects = allIntersects?.filter((item) => item.object.userData.pickable);
//   if (allObjects.length > 0) {
//     const object = allObjects[0].object;
//     const target = Utils.lookUpElement(object)

//     var intersectPoint = me.engine.pickController.intersectPlane(event);

//     if (intersectPoint) {
//       me.dragDelta.subVectors(intersectPoint, target.position);
//     }

//     me.dragObject = target;
//     me.activeObject?.disActive();
//     me.activeObject = target;
//     me.activeObject?.active();
//     // 更新当前选中的物体
//     // if (!object.userData.hasOutline) {
//     //   object.userData.hasOutline = true;
//     //   if (outlinePass && composer) {
//     //     outlinePass.selectedObjects = [object]
//     //     composer.addPass(outlinePass);
//     //   }
//     // } else {
//       // object.userData.hasOutline = false;
//       // outlinePass.selectedObjects = scene.children.filter((item) => item.userData.hasOutline);
//       // composer.removePass(outlinePass);
//       // me.dragObject = null;
//     // }
//   } else {
//     me.activeObject?.disActive();
//     // if (outlinePass && composer) {
//     //   outlinePass.selectedObjects = [];
//     //   composer.removePass(outlinePass);
//     // }

//     // const elements = me.engine.controller.element
//     // elements?.traverse(function (node) {
//     //   if (node instanceof THREE.Mesh) {
//     //     node.userData.hasOutline = false;
//     //   }
//     // });

//     me.dragObject = undefined;
//     me.activeObject = undefined;
//   }
// }