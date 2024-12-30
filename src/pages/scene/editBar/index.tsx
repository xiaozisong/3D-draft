import { EditOutlined, RiseOutlined, StockOutlined, DeleteOutlined } from "@ant-design/icons";
import { Space, Button, Tooltip } from "antd";
import styles from "./index.less";
import { useEngine } from "@/engine";
import { useStore } from "@/components/store/useStore";
import { isEmpty } from "lodash";
import { useCallback } from "react";
import CommandManager from "@/engine/tools/command/CommandManager";

export const EditBar = () => {
  const engine = useEngine();
  const [{ editbarVisible, editbarPosition }] = useStore(engine.controller.setting.store, [
    "editbarVisible",
    "editbarPosition",
  ]);

  // 箭头连接
  // const handleArrowConnect = useCallback(() => {
  //   engine.controller.action.line.startAddArrowConnect()
  // },[]);

  // 开始连线
  const handleLineConnect = useCallback((showArrow: boolean) => {
    engine.commandManager.executeCommand(new CommandManager.CreateLineCommand(engine, showArrow));
  }, []);

  // 添加文字
  const handleAddText = useCallback(() => {
    engine.controller.action.text.addTextForActiveElement();
  }, []);

  // 删除选中元素
  const handleDelete = useCallback(() => {
    engine.controller.element.deleteSelectedElement();
  }, [])

  if (!editbarVisible) {
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
          onClick={handleLineConnect.bind(null, true)}
          className={styles.button}
        />
      </Tooltip>
      <Tooltip title='线条连接' placement="right">
        <Button
          type='primary'
          shape='circle'
          icon={<StockOutlined />}
          className={styles.button}
        />
      </Tooltip>
      <Tooltip title='添加文字' placement="right">
        <Button
          type='primary'
          shape='circle'
          icon={<EditOutlined />}
          onClick={handleAddText.bind(null)}
          className={styles.button}
        />
      </Tooltip>
      <Tooltip
        title='删除'
        placement='right'
      >
        <Button
          type='primary'
          danger
          shape='circle'
          icon={<DeleteOutlined />}
          onClick={handleDelete.bind(null)}
          className={styles.button}
        />
      </Tooltip>
    </Space>
  );
};
