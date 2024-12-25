import { Schema } from "@/components/dynamicform";
import { Icon } from ".";
import { COLOR_PRESETS } from "@/engine/constant/color";
import unitSchema from "../unit/schema";
const iconTypeOptions = () => {
}
export default {
  properties: {
    ...unitSchema.properties,
    size: {
      type: 'number',
      title: "尺寸",
      componentType: "InputNumber",
      props: {
        min: 1,
        step: 1,
        precision: 2,
        style: { width: '100%' }
      },
      onChange: ({ key, value, instance }) => {
        (instance as Icon).changeSize({ value, type: key });
      }
    },
    type: {
      type: 'string',
      title: "类型",
      componentType: "IconSelect",
      props: {
        options: [],
        style: { width: '100%' }
      },
      onChange: ({ key, value, instance }) => {
        (instance as Icon).changeType({ value, type: key });
      }
    },
    depth: {
      type: 'number',
      title: "厚度",
      componentType: "InputNumber",
      props: {
        min: 0.01,
        step: 0.01,
        precision: 2,
        style: { width: '100%' }
      },
      onChange: ({ key, value, instance }) => {
        (instance as Icon).changeDepth({ value, type: key });
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
        (instance as Icon).changeColor({ value, type: key });
      }
    },
  },
} as Schema