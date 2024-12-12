import { ElementData } from "@/engine/interface";
import { Render } from "@/engine/render";
import { message } from "antd";
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
    for (let i = 0; i < data.length; i++) {
      me.engine.controller?.element?.addElement(data[i])
    }
  }

  // 保存
  save() {
    const me = this;
    const data = this.engine.controller.element?.getData();
    console.log('data', data)
    localStorage.setItem('elements', JSON.stringify(data))
    message.success("保存成功");
  }

}