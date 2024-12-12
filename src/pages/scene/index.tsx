import { useEngine } from "@/engine";
import styles from "./index.less";
import { Collapse, Typography } from "antd";
const { Title } = Typography;
import { useLayoutEffect, useRef, useState } from "react";
import { useLocalStorageState } from "ahooks";
import { ElementData } from "@/engine/interface";
import ToolBar from "./toolbar";
import { EditBar } from "./editBar";

export default function Scene() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const engine = useEngine();

  const [elementsData, setElementsData] = useLocalStorageState<ElementData[]>("elements", {
    defaultValue: [
      // {
      //   type: "cube",
      //   options: {
      //     x: 0,
      //     z: 0,
      //   },
      // },
    ],
  });

  // 初始化3D场景
  useLayoutEffect(() => {
    const container = ref.current;
    if (container && !ready) {
      engine.initDom(container);
      engine.controller.post?.initPostRender();
      if (elementsData) {
        engine.controller.data?.setData(elementsData);
      }
      setReady(true);
    }
  }, []);

  return (
    <div
      className={styles.main}
      ref={ref}
    >
      <ToolBar />
      <EditBar />
    </div>
  );
}
