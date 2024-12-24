import demoData from '@/assets/data';
import { useEngine } from "@/engine";
import { SceneData } from "@/engine/interface";
import { useLocalStorageState } from "ahooks";
import { Typography } from "antd";
import { useLayoutEffect, useRef, useState } from "react";
import { EditBar } from "./editBar";
import styles from "./index.less";
import ToolBar from "./toolbar";
import { Utils } from '@/engine/utils';

const { Title } = Typography;

export default function Scene() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const engine = useEngine();

  const [sceneData, setSceneData] = useLocalStorageState<SceneData>("isometric-3d-editor", {
    defaultValue: demoData,
  });

  // 初始化3D场景
  useLayoutEffect(() => {
    const container = ref.current;
    if (sceneData?.version !== VERSION) {
      return;
    }
    if (container && !ready) {
      engine.initDom(container);
      engine.controller.post?.initPostRender();
      const { elements, settings } = sceneData as SceneData;
      if (elements) {
        engine.controller.data?.setData(elements);
      }
      if (settings) {
        engine.controller.setting.applySetting(settings);
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
