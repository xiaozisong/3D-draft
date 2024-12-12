import { Link, Outlet } from "umi";
import styles from "./index.less";
import "./global.less";
import { Button } from "antd";
import { CodepenOutlined, PoweroffOutlined, SaveOutlined } from "@ant-design/icons";
import { useCallback, useEffect } from "react";
import { useEngine } from "@/engine";

export default function Layout() {
  const engine = useEngine();
  
  const handleSave = useCallback(() => {
    engine.controller?.data?.save();
  }, []);

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <div className={styles.title}>
          <CodepenOutlined /> 3D轴侧场景编辑器
        </div>
        <div className={styles.toolbar}>
          <Button
            type='primary'
            icon={<SaveOutlined />}
            size='small'
            onClick={handleSave}
          />
        </div>
      </div>
      <Outlet />
    </div>
  );
}
