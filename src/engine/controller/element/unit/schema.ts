import { Schema } from "@/components/dynamicform";
import { Unit3DObject } from ".";
import { OptionsType } from "@/engine/interface";
export default {
  properties: {
    name: {
      type: 'string',
      title: "名称",
      componentType: "Input",
      props: {
        style: { width: '100%' }
      },
      onChange: ({ key, value, instance }) => {
        (instance as Unit3DObject<OptionsType>).changeName({ value, type: key });
      }
    },
  },
} as Schema