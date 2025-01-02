import { Schema } from "@/components/dynamicform";
import { Cylinder } from ".";
import { COLOR_PRESETS } from "@/engine/constant/color";
import unitSchema from "../unit/schema";
import unitPostSchema from "../unit/postschema";

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

