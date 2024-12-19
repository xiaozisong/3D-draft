import { Element3D } from "@/engine/interface";
import { Render } from "@/engine/render";
import { Utils } from "@/engine/utils";
import * as THREE from "three";
import { Text } from '@/engine/controller/element/text';

export class TextAction {
  constructor(private engine: Render) {

  }

  // 添加文字
  addTextForActiveElement() {
    const activeElement = this.engine.controller.action.select.activeElement;
    if (!activeElement || activeElement.options.linkTextKey) {
      return;
    }
    const { z: length } = Utils.getGroupSize(activeElement);
    const position = activeElement.position;
    const text = this.engine.controller.element.addElement({
      type: 'text',
      options: {
        x: position.x,
        z: position.z + length / 2 + 0.25,
        content: activeElement.name,
        color: 'red',
        fontSize: 0.5
      }
    });
    activeElement.setOptions({
      linkTextKey: text.key,
    });
    text.setOptions({
      linkElementKey: activeElement.key,
    })
    this.updateTextRelactionPosition(text);
  }
  
  // 更新文字
  updateLinkTextPosition(element: Element3D) {
    const position = element.position;
    const linkTextKey = element.options.linkTextKey;
    if (!linkTextKey) { return }
    const linkText = this.engine.controller.element.getElementByKey(linkTextKey) as Text;
    if (linkText) {
      const point = new THREE.Vector3(position.x, position.y, position.z);
      const linkElementRelactionPosition = linkText.options.linkElementRelactionPosition;
      if (linkElementRelactionPosition) {
        point.add(linkElementRelactionPosition);
      }
      linkText.position.set(point.x, point.y, point.z);
    }
  }

  // 移动文字时，记录相对关联物体的位置
  updateTextRelactionPosition(text: Text) {
    const linkElementKey = text.options.linkElementKey;
    if (linkElementKey) {
      const element = this.engine.controller.element.getElementByKey(linkElementKey);
      const point = Utils.getObjectByKey({ key: linkElementKey, scene: this.engine.sceneController.scene });
      if (element) {
        text.setOptions({
          linkElementRelactionPosition: text.position.clone().sub(element.position),
        })
      }
      if (point) {
        text.setOptions({
          linkElementRelactionPosition: text.position.clone().sub(point.position),
        })
      }
    }
  }

  // 删除文字时移除关联关系
  removeTextLink(element: Text) {
    const linkElementKey = element.options.linkElementKey;
    if (linkElementKey) {
      const linkElement = this.engine.controller.element.getElementByKey(linkElementKey);
      if (linkElement) {
        linkElement.setOptions({
          linkTextKey: '',
        })
      }
    }
  }

  // 清除关联文字
  clearLinkText(element: Element3D) {
    if (element.options.linkTextKey) {
      this.engine.controller.element.removeElement(element.options.linkTextKey);
    }
  }
}