import { Element3D } from "@/engine/interface";
import { Render } from "@/engine/render";
import { Utils } from "@/engine/utils";
import * as THREE from "three";
import { Text } from '@/engine/controller/element/text';
import CommandManager from "@/engine/tools/command/CommandManager";

export class TextAction {
  constructor(private engine: Render) {

  }

  // 添加文字
  addTextForActiveElement() {
    const activeElement = this.engine.controller.action.select.activeElements[0];
    if (!activeElement || activeElement.options.linkTextKey) {
      return;
    }
    const { z: length, y } = Utils.getGroupSize(activeElement);
    const position = activeElement.position;
    const data = {
      type: 'text',
      options: {
        name: '文字',
        x: position.x,
        z: position.z + length / 2 + 0.25,
        y: position.y,
        text: activeElement.name,
        color: 'red',
        fontSize: 0.5,
        lineHeight: 1.5,
      }
    };
    const text = this.engine.commandManager.executeCommand(new CommandManager.AddElementCommand(this.engine, data)) as Text;
    activeElement.setOptions({
      linkTextKey: text.key,
    });
    text.setOptions({
      linkElementKey: activeElement.key,
    })
    this.updateTextRelactionPosition(text);
    this.engine.controller.element.refreshElementList();
  }
  
  // 更新文字
  updateLinkTextPosition(element: Element3D) {
    const position = element.position;
    const linkTextKey = element.options.linkTextKey;
    if (!linkTextKey) { return }
    const linkText = this.engine.controller.element.getElementByKey(linkTextKey) as Text;
    if (linkText) {
      const point = position.clone();
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
      if (element) {
        text.setOptions({
          linkElementRelactionPosition: text.position.clone().sub(element.position),
        })
      } else {
        const point = Utils.getObjectByKey({ key: linkElementKey, scene: this.engine.sceneController.scene });
        if (point) {
          text.setOptions({
            linkElementRelactionPosition: text.position.clone().sub(point.position)
          })
        }
      }
    }
    text.updateLinkLine();
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