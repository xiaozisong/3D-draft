import { Element3D } from "@/engine/interface";
import { Render } from "@/engine/render";

export class SelectAction {

  // 选中的物体组
  _activeElements: Element3D[] = [];

  constructor (private engine: Render) {

  }

  set activeElements(newElements: Element3D[]) {
    const me = this;
    // 让之前的选中取消选中
    for (const element of me.activeElements) {
      element.disActive();
    }
    this._activeElements = newElements;
    const newActiveElementKeys = newElements.map(element => element.key);
    this.engine.controller.setting.store.setState({
      activeElementKeys: newActiveElementKeys,
    });
    for (const element of newElements) {
      element.active();
    }
    this.engine.controller.setting.updateEditBar();
  }

  get activeElements() {
    return this._activeElements;
  }

  // 设置选中物体
  setActiveElements(newElements: Element3D[]) {
    this.activeElements = newElements;
  }

  // 选中物体
  selectObject(target: Element3D, event: MouseEvent): Element3D[] {
    const me = this;
    if (!target) {
      return target;
    }

    // 执行选中
    if (event.shiftKey) {
      me.activeElements = [...me.activeElements, target];
    } else {
      me.activeElements = [target];
    }
    return me.activeElements;
  }

  // 取消选中物体
  cancelSelectObject() {
    
  }

  // 移动物体
  moveObject(event: MouseEvent) {
    const me = this;
    for (const element of this.activeElements) {
      element?.disActive();
    }
    me.activeElements = [];
  }
}