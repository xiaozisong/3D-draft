import { Space, Switch } from "antd";
import styles from "./index.less";
import { useCallback } from "react";
import { useEngine } from "@/engine";

export default function Toolbar() {
  const engine = useEngine();

  const handle2DChange = useCallback((checked: boolean) => {
    engine.cameraController.toogleCamera(checked);
  }, []);

  return (
    <Space className={styles.toolbar}>
      <Space className={styles.left}>{"  "}</Space>
      <Space className={styles.right}>
        <Switch
          checkedChildren='3D'
          unCheckedChildren='2D'
          defaultChecked
          onChange={handle2DChange}
        />
      </Space>
    </Space>
  );
}
