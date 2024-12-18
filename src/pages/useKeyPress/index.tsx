import { useEngine } from "@/engine";
import { useKeyPress } from "ahooks";

const useKeyPressEffect = () => {
  // 获取engine类
  const engine = useEngine();
  // 监听 删除、保存、退出
  useKeyPress(["backspace", "delete"], (event) => {
    console.log('删除')
   event.preventDefault();
    engine.controller.element?.removeSelectedElement();
  });

  useKeyPress(["meta.s"], (event) => {
    console.log('保存')
    event.preventDefault();
    engine.controller.data?.save();
  });

  useKeyPress(["esc"], (event) => {
    event.preventDefault();
    engine.controller.action.line.endCreateLine();
  });
};

export default useKeyPressEffect;
