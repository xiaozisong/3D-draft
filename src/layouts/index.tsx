import { Link, Outlet } from "umi";
import styles from "./index.less";
import "./global.less";
import { Button, Space, Tooltip } from "antd";
import { 
  CodepenOutlined, 
  PoweroffOutlined, 
  SaveOutlined,
  ArrowDownOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect } from "react";
import { useEngine } from "@/engine";
import elementsData from '@/assets/data';

export default function Layout() {
  const engine = useEngine();

  const handleSave = useCallback(() => {
    engine.controller?.data?.save();
  }, []);

  const handleLoadDemoData = useCallback(() => {
    engine.controller.data?.setData(elementsData.elements);
  }, []);

  const handleClear = useCallback(() => {
    engine.controller.data.clear();
  }, [])

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <div className={styles.title}>
          <CodepenOutlined /> 3D轴侧场景编辑器
        </div>
        <Space className={styles.toolbar}>
        <Tooltip title='清空场景'>
            <Button
              icon={<ClearOutlined />}
              size='small'
              onClick={handleClear}
            />
          </Tooltip>
          <Tooltip title='加载示例'>
            <Button
              icon={<ArrowDownOutlined />}
              size='small'
              onClick={handleLoadDemoData}
            />
          </Tooltip>
          <Tooltip title='保存'>
            <Button
              type='primary'
              icon={<SaveOutlined />}
              size='small'
              onClick={handleSave}
            />
          </Tooltip>
        </Space>
      </div>
      <Outlet />
    </div>
  );
}
