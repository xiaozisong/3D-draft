import { DynamicForm, Schema, Value } from "@/components/dynamicform";
import styles from "./index.less";
import { Collapse, Form, Typography } from "antd";
import { useCallback, useLayoutEffect, useMemo } from "react";
import { useEngine } from "@/engine";
import { useStore } from "@/components/store/useStore";
import { get } from "lodash";
import { getTypeByString } from "@/engine/interface/utils";
const { Title } = Typography;

export default function ProtoPanel() {
  const engine = useEngine();
  const [{ activeElementKeys }] = useStore(engine.controller.setting.store, ['activeElementKeys']);

  const [form] = Form.useForm();

  const schema = useMemo(() => {
    const activeElement = engine.controller.action.select.activeElement;
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
    const activeElement = engine.controller.action.select.activeElement;
    if (!activeElement) { return; }
    const entries = Object.entries(changedValues) as [string, Value][];
    const properties = schema.properties;
    entries.forEach(([key, value]) => {
      const field = get(properties, `${key}`);
      const valueType = getTypeByString(field?.type);
      if (field?.onChange) {
        const typedValue = value as typeof valueType;
        field.onChange({ key, value: typedValue, instance: activeElement });
      }
    });
  }, [activeElementKeys, schema]);

  useLayoutEffect(() => {
    const activeElement = engine.controller.action.select.activeElement;
    if (activeElement) {
      form.setFieldsValue(activeElement.options);
    }
  }, [activeElementKeys]);

  if (!schema) { return; }

  return (
    <div className={styles.right}>
      <div className={styles.title}>
        <Title level={5}>属性</Title>
      </div>
      <DynamicForm
        schema={schema}
        size='small'
        layout='vertical'
        onValuesChange={onValuesChange}
        form={form}
      />
    </div>
  );
}