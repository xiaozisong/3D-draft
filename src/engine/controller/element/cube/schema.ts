import { Schema } from "@/components/dynamicform";
import { Cube } from ".";
import { COLOR_PRESETS } from '@/engine/constant/color';
import unitSchema from "../unit/schema";
import unitPostSchema from "../unit/postschema";

export default {
  properties: {
    ...unitSchema.properties,
    length: {
      type: 'number',
      title: "长度",
      componentType: "InputNumber",
      props: {
        min: 0.25,
        style: { width: '100%' }
      },
      onChange: ({ key, value, instance }) => {
        (instance as Cube).changeSize({ value, type: key });
      }
    },
    width: {
      type: 'number',
      title: "宽度",
      componentType: "InputNumber",
      props: {
        min: 0.25,
        style: { width: '100%' }
      },
      onChange: ({ key, value, instance }) => {
        (instance as Cube).changeSize({ value, type: key });
      }
    },
    height: {
      type: 'number',
      title: "高度",
      componentType: "InputNumber",
      props: {
        min: 0.25,
        style: { width: '100%' }
      },
      onChange: ({ key, value, instance }) => {
        (instance as Cube).changeSize({ value, type: key });
      }
    },
    color: {
      type: 'string',
      title: "颜色",
      componentType: "ColorPicker",
      props: {
        // min: 0.25,
        // style: { width: '100%' },
        showText: true,
        presets: COLOR_PRESETS,
      },
      onChange: ({ key, value, instance }) => {
        (instance as Cube).changeColor({ value, type: key });
      }
    },
    ...unitPostSchema.properties
  },
} as Schema