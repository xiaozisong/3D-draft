import { useEngine } from "@/engine";
import { useKeyPress } from "ahooks";

const useKeyPressEffect = () => {
  // 获取engine类
  const engine = useEngine();
  // 监听 删除、保存、退出
  useKeyPress("delete", () => {
    const activeElementKey = engine.controller.event?.activeObject?.key;
    if (!activeElementKey) {
      return;
    }
    engine.controller.element?.removeElement(activeElementKey);
  });

  useKeyPress(["meta.s"], (event) => {
    event.preventDefault();
    engine.controller.data?.save();
  });

  useKeyPress(["esc"], (event) => {
    event.preventDefault();
    engine.controller.action.line.cancelAction();
  });
};

export default useKeyPressEffect;
