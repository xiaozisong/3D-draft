import { ElementData } from "@/engine/interface";
import { Render } from "@/engine/render";
import { message } from "antd";
import { set } from "lodash";
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
    setTimeout(() => {
      for (let i = 0; i < lineData.length; i++) {
        me.engine.controller?.element?.addElement(lineData[i]);
      }
    }, 100)
  }

  // 保存
  save() {
    const me = this;
    const data = this.engine.controller.element?.getData();
    console.log('data', data)
    localStorage.setItem('elements', JSON.stringify(data))
    message.success("保存成功");
  }

  clear() {
    this.engine.controller.element.clearData();
  }

}