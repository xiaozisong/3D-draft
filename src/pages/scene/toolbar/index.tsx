import { Space, Switch, Button, Input, InputNumber, Popover, Tooltip} from "antd";
import styles from "./index.less";
import { useCallback, useMemo } from "react";
import { useEngine } from "@/engine";
import { TableOutlined } from "@ant-design/icons";
import { useStore } from "@/components/store/useStore";
import { div } from "three/examples/jsm/nodes/Nodes.js";

export default function Toolbar() {
  const engine = useEngine();

  const [{ gridSize }] = useStore(engine.controller.setting.store, ['gridSize']);

  const handle2DChange = useCallback((checked: boolean) => {
    engine.cameraController.toogleCamera(checked);
  }, []);

  const handleSizeChange = useCallback((size: number | null) => {
    engine.controller.setting.changeSetting('gridSize', size || 1);
  }, []);

  const sizeForm = useMemo(() => {
    return (
      <div className={styles.sizeForm}>
        <Space>
          <InputNumber
            value={gridSize}
            onChange={(value) => handleSizeChange(value)}
            min={8}
            step={2}
          />
        </Space>
      </div>
    )
  }, [gridSize]);

  return (
    <Space className={styles.toolbar}>
      <Space className={styles.left}>{"  "}</Space>
      <Space className={styles.right}>
      <Popover
          placement='bottomRight'
          title={"网格地面尺寸"}
          content={sizeForm}
          trigger='click'
          overlayClassName={styles.popover}
        >
          <Button
            size='small'
            icon={<TableOutlined />}
          />
        </Popover>
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
