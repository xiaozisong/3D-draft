import { Link, Outlet } from "umi";
import styles from "./index.less";
import "./global.less";
import { Button, Space } from "antd";
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
    engine.controller.data?.setData(elementsData);
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
          <Button
            icon={<ClearOutlined />}
            size='small'
            onClick={handleClear}
          />
          <Button
            icon={<ArrowDownOutlined />}
            size='small'
            onClick={handleLoadDemoData}
          />
          <Button
            type='primary'
            icon={<SaveOutlined />}
            size='small'
            onClick={handleSave}
          />
        </Space>
      </div>
      <Outlet />
    </div>
  );
}
