import { ElementData } from "@/engine/interface";
import { Render } from "@/engine/render";
import { message } from "antd";
import { set } from "lodash";
import { Utils } from "@/engine/utils";
export class Data {

  constructor(private engine: Render) {

  }

  // 获取数据
  getData() {
    return this.engine.controller?.element?.getData()
  }

  // 初始化数据
  setData(data: ElementData[]) {
    const me = this;
    const lineData = data.filter(item => item.type === 'line');
    const otherData = data.filter(item => item.type !== 'line');
    for (let i = 0; i < otherData.length; i++) {
      me.engine.controller?.element?.addElement(otherData[i]);
    }
    Utils.Render.executeAfterFrames(() => {
      for (let i = 0; i < lineData.length; i++) {
        me.engine.controller?.element?.addElement(lineData[i]);
      }
      me.engine.controller.element.store.setState({
        elementListHash: Date.now().toString(),
      });
    }, 1)
  }

  // 保存
  save() {
    const me = this;
    const elements = me.engine.controller.element?.getData();
    const settings = me.engine.controller.setting.store.getState();
    console.log('data', elements)
    localStorage.setItem('isometric-3d-editor', JSON.stringify({
      elements,
      settings,
      version: VERSION,
    }))
    message.success("保存成功");
  }

  clear() {
    this.engine.controller.element.clearData();
    this.save();
  }

}