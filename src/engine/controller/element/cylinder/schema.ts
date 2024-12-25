import { Schema } from "@/components/dynamicform";
import { Cylinder } from ".";
import { COLOR_PRESETS } from "@/engine/constant/color";
import  unitSchema  from "../unit/schema";
export default {
  properties: {
    ...unitSchema.properties,
    radius: {
      type: 'number',
      title: "半径",
      componentType: "InputNumber",
      props: {
        min: 0.5,
        step:0.5,
        style: { width: '100%' }
      },
      onChange: ({ key, value, instance }) => {
        (instance as Cylinder).changeSize({ value, type: key });
      }
    },
    height: {
      type: 'number',
      title: "高度",
      componentType: "InputNumber",
      props: {
        min: 0.5,
        step:0.5,
        style: { width: '100%' }
      },
      onChange: ({ key, value, instance }) => {
        (instance as Cylinder).changeSize({ value, type: key });
      }
    },
    color: {
      type: 'string',
      title: "颜色",
      componentType: "ColorPicker",
      props: {
        showText: true,
        presets: COLOR_PRESETS
      },
      onChange: ({ key, value, instance }) => {
        (instance as Cylinder).changeColor({ value, type: key });
      }
    },
  },
} as Schema

