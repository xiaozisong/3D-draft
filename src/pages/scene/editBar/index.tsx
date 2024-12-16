import { EditOutlined, RiseOutlined, StockOutlined } from "@ant-design/icons";
import { Space, Button, Tooltip } from "antd";
import styles from "./index.less";
import { useEngine } from "@/engine";
import { useStore } from "@/components/store/useStore";
import { isEmpty } from "lodash";
import { useCallback } from "react";

export const EditBar = () => {
  const engine = useEngine();
  const [{ activeElementKeys, editbarPosition }] = useStore(engine.controller.setting.store, [
    "activeElementKeys",
    "editbarPosition",
  ]);


  // 箭头连接
  const handleArrowConnect = useCallback(()=>{
    engine.controller.action.line.startAddArrowConnect()
  },[])

  if (isEmpty(activeElementKeys)) {
    return null;
  }

  return (
    <Space
      direction='vertical'
      className={styles.editbar}
      style={{
        top: editbarPosition.y,
        left: editbarPosition.x,
      }}
    >
      <Tooltip title='箭头连接' placement="right">
        <Button
          type='primary'
          shape='circle'
          icon={<RiseOutlined />}
          onClick={handleArrowConnect}
        />
      </Tooltip>
      <Tooltip title='线条连接' placement="right">
        <Button
          type='primary'
          shape='circle'
          icon={<StockOutlined />}
        />
      </Tooltip>
      <Tooltip title='添加文字' placement="right">
        <Button
          type='primary'
          shape='circle'
          icon={<EditOutlined />}
        />
      </Tooltip>
    </Space>
  );
};
