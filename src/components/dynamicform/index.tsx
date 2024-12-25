import { Element3D } from "@/engine/interface";
import { ColorPicker, Form, FormProps, Input, InputNumber, Checkbox } from "antd";
import { isEmpty } from "lodash";
import React from "react";
import IconSelect from "../iconselect";

const componentMap: Record<string, React.FC<any>> = {
  Input,
  InputNumber,
  ColorPicker,
  TextArea: Input.TextArea,
  Checkbox,
  IconSelect,
};

export type Value = any;

export interface SchemaField {
  type: "string" | "number" | "boolean";
  title: string;
  componentType?: string;
  props?: any;
  options?: any;
  onChange?: ({ key, value, instance }: { key: string; value: Value; instance: Element3D }) => void;
}

export interface Schema {
  properties: Record<string, SchemaField>;
}

export interface DynamicFormProps extends FormProps {
  schema: Schema;
}

// 动态表单组件
export const DynamicForm = (props: DynamicFormProps) => {
  const { schema, ...restProps } = props;

  const renderField = (key: string, schemaField: SchemaField) => {
    const { title, componentType = "Input", props: fieldProps, options } = schemaField;

    return (
      <Form.Item
        key={key}
        label={title}
        name={key}
        {...options}
      >
        {React.createElement(componentMap[componentType], fieldProps)}
      </Form.Item>
    );
  };

  if (isEmpty(schema?.properties)) {
    return null;
  }

  return (
    <Form {...restProps}>
      {Object.keys(schema.properties).map((key) => renderField(key, schema.properties[key]))}
    </Form>
  );
}