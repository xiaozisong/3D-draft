import { Schema } from "@/components/dynamicform";
import { Line } from ".";
import { COLOR_PRESETS } from "@/engine/constant/color";
import unitSchema from "../unit/schema";

export default {
  properties: {
    ...unitSchema.properties,
    color: {
      type: 'string',
      title: '颜色',
      componentType: 'ColorPicker',
      props: {
        showText: true,
        presets: COLOR_PRESETS,
      },
      onChange: ({ value, key, instance }) => {
        (instance as Line).changeProperty({ value, type: key });
      }
    },
    lineWidth: {
      type: 'number',
      title: '线宽',
      componentType: 'InputNumber',
      props: {
        min: 0.02,
        step: 0.01,
        max: 0.05,
        style: { width: '100%' },
      },
      onChange: ({ value, key, instance }) => {
        (instance as Line).changeProperty({ value, type: key });
      }
    },
    dashed: {
      type: 'number',
      title: '虚线',
      componentType: 'Checkbox',
      props: {
       
      },
      options: {
        valuePropName: 'checked'
      },
      onChange: ({ value, key, instance }) => {
        (instance as Line).changeProperty({ value, type: key });
      }
    },
  }
} as Schema;