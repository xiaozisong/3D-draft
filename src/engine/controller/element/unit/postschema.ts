import { Schema } from "@/components/dynamicform";
import { Unit3DObject } from ".";
import { OptionsType } from "@/engine/interface";
export default {
  properties: {
    y: {
      type: 'string',
      title: "离地高度",
      componentType: "InputNumber",
      props: {
        min: 0,
        max:100,
        step: 0.1,
        precision: 1,
        style: { width: '100%' }
      },
      onChange: ({ key, value, instance }) => {
        (instance as Unit3DObject<OptionsType>).setPositionY({ value, type: key });
      }
    },
  },
} as Schema