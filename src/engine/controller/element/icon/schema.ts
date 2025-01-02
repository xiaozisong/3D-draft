import { Schema } from "@/components/dynamicform";
import { Icon } from ".";
import { COLOR_PRESETS } from "@/engine/constant/color";
import unitSchema from "../unit/schema";
import unitPostSchema from "../unit/postschema";

const iconTypeOptions = () => {
}
export default {
  properties: {
    ...unitSchema.properties,
    type: {
      type: 'string',
      title: "类型",
      componentType: "IconSelect",
      props: {
        options: [],
        style: { width: '100%' }
      },
    },
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
    },
    color: {
      type: 'string',
      title: "颜色",
      componentType: "ColorPicker",
      props: {
        showText: true,
        presets: COLOR_PRESETS
      },
    },
    ...unitPostSchema.properties,
  },
} as Schema