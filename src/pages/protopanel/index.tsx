import { DynamicForm, Schema, Value } from "@/components/dynamicform";
import { useStore } from "@/components/store/useStore";
import commonStyle from "@/components/styles/common.less";
import { useEngine } from "@/engine";
import { getTypeByString } from "@/engine/interface/utils";
import { Empty, Form, Typography } from "antd";
import { get, isEmpty } from "lodash";
import { useCallback, useLayoutEffect, useMemo, useRef, memo } from "react";
import styles from "./index.less";
const { Title } = Typography;

function ProtoPanel() {
  const engine = useEngine();
  const [{ activeElementKeys }] = useStore(engine.controller.setting.store, ['activeElementKeys']);

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
      if (field?.onChange) {
        const typedValue = value as typeof valueType;
        field.onChange({ key, value: typedValue, instance: activeElement });
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
  }, [activeElementKeys]);

  return (
    <div className={styles.proto}>
      <div className={commonStyle.title}>
        <Title level={5}>属性</Title>
      </div>
      <div className={styles.content}>
        {!isEmpty(activeElementKeys) && schema ? (
          <DynamicForm
            schema={schema}
            // size='small'
            layout='vertical'
            onValuesChange={onValuesChange}
            form={form}
          />
        ) : (
          <div className={styles.empty}>
            <Empty description={'选择物体后显示属性'} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtoPanel;