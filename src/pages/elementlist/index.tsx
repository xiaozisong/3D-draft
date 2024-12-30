import { useStore } from "@/components/store/useStore";
import commonStyle from "@/components/styles/common.less";
import { useEngine } from "@/engine";
import { Element3D } from "@/engine/interface";
import { Button, List, Typography, Empty } from "antd";
import classnames from "classnames";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import styles from "./index.less";
import { DeleteOutlined } from "@ant-design/icons";
import { Utils } from "@/engine/utils";
import { isEmpty } from "lodash";
const { Title } = Typography;

const ElementList = () => {
  const engine = useEngine();
  const [{ elementListHash }] = useStore(engine.controller.element.store, ['elementListHash']);
  const [{ activeElementKeys }] = useStore(engine.controller.setting.store, ['activeElementKeys']);

  const listRef = useRef<HTMLDivElement | null>(null);

  // 数据
  const dataSource = useMemo(() => {
    const result = engine.controller.element.getElementList();
    return result;
  }, [elementListHash]);

  // 选中
  const handleItemClick = useCallback((item: Element3D) => {
    engine.controller.action.select.activeElement = item;
  }, []);

  // 删除
  const handleDelete = useCallback((item: Element3D) => {
    engine.controller.element.deleteSelectedElement();
  }, []);

  // 选中元素滚动到可视区域
  useEffect(() => {
    const activeItem = listRef.current?.querySelector(".item-active");
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeElementKeys]);

  return (
    <div className={styles.elementList}>
      <div className={commonStyle.title}>
        <Title level={5}>场景元素</Title>
      </div>
      <div
        className={styles.content}
        ref={listRef}
      >
        {!isEmpty(dataSource) ? <List
          bordered={false}
          dataSource={dataSource}
          renderItem={(item) => (
            <List.Item
              key={item.key}
              className={classnames(
                styles.item,
                activeElementKeys.includes(item.key) && styles.active,
                activeElementKeys.includes(item.key) && "item-active"
              )}
              onClick={handleItemClick.bind(null, item)}
            >
              <div className={styles.itemContent}>{item?.options.name}</div>
              <Button
                className={styles.delete}
                size='small'
                type='primary'
                danger
                onClick={handleDelete.bind(null, item)}
              >
                <DeleteOutlined />
              </Button>
            </List.Item>
          )}
        /> : (
          <div className={styles.empty}>
            <Empty description={"暂无元素"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ElementList);
