import { useStore } from "@/components/store/useStore";
import { useEngine } from "@/engine";
import { TableOutlined, CameraOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Space, Switch, Button, Input, InputNumber, Popover, Tooltip} from "antd";
import { useCallback, useMemo, memo } from "react";
import styles from "./index.less";

function Toolbar() {
  const engine = useEngine();

  const [{ gridSize, cameraType, isIsometricView }] = useStore(engine.controller.setting.store, ['gridSize', 'cameraType', 'isIsometricView']);

  // 切换3d/2d视图
  const handle2DChange = useCallback((checked: boolean) => {
    engine.cameraController.toogleCamera(false);
    engine.cameraController.toogleIsometricView(checked);
  }, []);

  // 改变网格地面尺寸
  const handleSizeChange = useCallback((size: number | null) => {
    engine.controller.setting.changeSetting('gridSize', size || 1);
  }, []);

  // 切换相机
  const handleCameraChange = useCallback((checked: boolean) => {
    engine.cameraController.toogleIsometricView(true);
    engine.cameraController.toogleCamera(checked);
  }, [])

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
          checkedChildren={<VideoCameraOutlined />}
          unCheckedChildren={<CameraOutlined />}
          // defaultChecked={false}
          checked={cameraType === 'perspectiveCamera'}
          onChange={handleCameraChange}
        />
        <Switch
          checkedChildren='3D'
          unCheckedChildren='2D'
          // defaultChecked
          checked={isIsometricView}
          onChange={handle2DChange}
        />
      </Space>
    </Space>
  );
}

export default memo(Toolbar);