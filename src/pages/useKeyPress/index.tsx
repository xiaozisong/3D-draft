import { useEngine } from "@/engine";
import { useKeyPress } from "ahooks";
import { Utils } from "@/engine/utils";

const useKeyPressEffect = () => {
  // 获取engine类
  const engine = useEngine();
  // 监听 删除、保存、退出
  useKeyPress(["backspace", "delete"], (event) => {
    const prevent = Utils.Dom.preventInputEvent(event);
    if (prevent) { return; }
    event.preventDefault();
    engine.controller.element?.deleteSelectedElement();
  });

  useKeyPress(["meta.s"], (event) => {
    console.log('保存')
    event.preventDefault();
    engine.controller.data?.save();
  });

  useKeyPress(["esc", "enter"], (event) => {
    event.preventDefault();
    engine.controller.action.line.endCreateLine();
  });

  // 复制物体
  useKeyPress(['ctrl.c', 'meta.c'], (event) => {
    const prevent = Utils.Dom.preventInputEvent(event);
    if (prevent) { return; }
    event.preventDefault();
    engine.controller.element.copySelectedElement();
  });

  // 粘贴物体
  useKeyPress(['ctrl.v', 'meta.v'], (event) => {
    const prevent = Utils.Dom.preventInputEvent(event);
    if (prevent) { return; }
    event.preventDefault();
    engine.controller.element.pasteElement();
  });

  // 撤销
  useKeyPress(["ctrl.z", "meta.z"], (event) => {
    const prevent = Utils.Dom.preventInputEvent(event);
    if (prevent) { return; }
    event.preventDefault();
    engine.commandManager.undo();
  }, { exactMatch: true });

  // 重做
  useKeyPress(["shit.ctrl.z", "shift.meta.z"], (event) => {
    const prevent = Utils.Dom.preventInputEvent(event);
    if (prevent) { return; }
    event.preventDefault();
    engine.commandManager.redo();
  }, { exactMatch: true });
};

export default useKeyPressEffect;
