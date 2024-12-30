import { Schema } from "@/components/dynamicform";
import { Area } from ".";
import { COLOR_PRESETS } from "@/engine/constant/color";
import unitSchema from '../unit/schema';
import unitPostSchema from "../unit/postschema";

export default {
  properties: {
    ...unitSchema.properties,
    length: {
      type: 'number',
      title: '长度',
      componentType: 'InputNumber',
      props: {
        min: 0.25,
        style: { width: '100%' }
      },
      onChange: ({ key, value, instance }) => {
        (instance as Area).changeSize({ value, type: key });
      }
    },
    width: {
      type: 'number',
      title: '宽度',
      componentType: 'InputNumber',
      props: {
        min: 0.2,
        style: { width: '100%' }
      },
      onChange: ({ key, value, instance }) => {
        (instance as Area).changeSize({ value, type: key });
      }
    },
    color: {
      type: 'string',
      title: '颜色',
      componentType: 'ColorPicker',
      props: {
        showText: true,
        presets: COLOR_PRESETS,
      },
      onChange: ({ key, value, instance }) => {
        (instance as Area).changeColor({ value, type: key });
      }
    },
    // height: {
    //   type: 'number',
    //   title: '高度',
    //   componentType: 'InputNumber',
    //   props: {
    //     showText: true,
    //     presets: COLOR_PRESETS,
    //   },
    //   onChange: ({ key, value, instance }) => {
    //     (instance as Area).changeColor({ value, type: key });
    //   }
    // },
    opacity: {
      type: 'string',
      title: '不透明度',
      componentType: 'InputNumber',
      props: {
        min: 0.1,
        max: 1,
        step: 0.1,
        style: { width: '100%' }
      },
      onChange: ({ key, value, instance }) => {
        (instance as Area).changeOpacity({ value, type: key });
      }
    },
    ...unitPostSchema.properties,
  }
} as Schema;