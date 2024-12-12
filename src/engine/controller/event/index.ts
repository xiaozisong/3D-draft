import { Element3D, LineActionStatus } from "@/engine/interface";
import { Render } from "@/engine/render";
import { MeshElement, Utils } from "@/engine/utils";
import * as THREE from "three";
import { RenderPass, EffectComposer, OutlinePass } from "three/addons";

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
      this.engine.controller.setting.updateEditBarPosition();
    } else {
      activeElementKeys = []
    }
    this.engine.controller.setting?.store.setState({
      activeElementKeys,
    })
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
    me.dragObject.position.x = intersectPoint.x - me.dragDelta.x;
    me.dragObject.position.z = intersectPoint.z - me.dragDelta.z;
    me.dragObject.position.y = me.dragObject?.groundGap || 0;
    this.engine.controller.setting.updateEditBarPosition();
  }

  // 鼠标按下
  pointdown(event: MouseEvent) {
    const me = this;
    event.preventDefault();
    me.selectObject(event);
  }

  // 鼠标移动
  pointerMove(event: MouseEvent) {
    const me = this;
    if (me.dragObject) {
      me.moveObject(event);
    }
    if (me.engine.controller.action.line.status === LineActionStatus.add) {
      me.engine.controller.action.line.addingArrowPositionUpdate(event);
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