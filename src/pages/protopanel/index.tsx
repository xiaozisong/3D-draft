import { DynamicForm, Schema, Value } from "@/components/dynamicform";
import { useStore } from "@/components/store/useStore";
import commonStyle from "@/components/styles/common.less";
import { useEngine } from "@/engine";
import { getTypeByString } from "@/engine/interface/utils";
import { Empty, Form, Typography } from "antd";
import { get, isEmpty } from "lodash";
import { useCallback, useLayoutEffect, useMemo, useRef, memo } from "react";
import styles from "./index.less";
import CommandManager from "@/engine/tools/command/CommandManager";
const { Title } = Typography;

function ProtoPanel() {
  const engine = useEngine();
  const [{ activeElementKeys }] = useStore(engine.controller.setting.store, ['activeElementKeys']);
  const [{ protoPanelHash }] = useStore(engine.controller.element.store, ['protoPanelHash']);

  const [form] = Form.useForm();

  const schema = useMemo(() => {
    const activeElement = engine.controller.action.select.activeElements[0];
    if (activeElement) {
      const schema = get(activeElement, 'constructor.schema') as unknown as Schema;
      if (schema) {
        return schema;
      }
    }
    return null
  }, [activeElementKeys]);

  const onValuesChange = useCallback((changedValues: any) => {
    if (!schema) {
      return;
    }
    const activeElement = engine.controller.action.select.activeElements[0];
    if (!activeElement) { return; }
    const entries = Object.entries(changedValues) as [string, Value][];
    const properties = schema.properties;
    entries.forEach(([key, value]) => {
      const field = get(properties, `${key}`);
      const valueType = getTypeByString(field?.type);
      const typedValue = value as typeof valueType;

      // 统一属性变更命令
      engine.commandManager.executeCommand(
        new CommandManager.AttributeUpdateCommand(engine, {
          element: activeElement,
          fieldData: { value: typedValue, type: key }
        })
      )
      if (field?.onChange) {
        field.onChange({ key, value: typedValue, instance: activeElement, engine });
      }
    });
  }, [schema]);

  useLayoutEffect(() => {
    const activeElement = engine.controller.action.select.activeElements[0];
    if (activeElement) {
      form.setFieldsValue(activeElement.options);
    }
    return () => {
      if (form) {
        form.resetFields();
      }
    }
  }, [activeElementKeys, protoPanelHash]);

  return (
    <div className={styles.proto}>
      <div className={commonStyle.title}>
        <Title level={5}>属性</Title>
      </div>
      <div className={styles.content}>
        {activeElementKeys.length === 1 && schema ? (
          <DynamicForm
            schema={schema}
            // size='small'
            layout='vertical'
            onValuesChange={onValuesChange}
            form={form}
          />
        ) : (
          <div className={styles.empty}>
            <Empty description={'单选物体后显示属性'} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtoPanel;