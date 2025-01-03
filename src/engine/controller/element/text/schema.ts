import { Schema } from "@/components/dynamicform";
import { Text } from ".";
import { COLOR_PRESETS } from "@/engine/constant/color";
import unitSchema from "../unit/schema";
import unitPostSchema from "../unit/postschema";

export default {
  properties: {
    ...unitSchema.properties,
    text: {
      type: 'string',
      title: '内容',
      componentType: 'TextArea',
      props: {
        min: 0.25,
        style: { width: '100%' }
      },
    },
    fontSize: {
      type: 'number',
      title: '大小',
      componentType: 'InputNumber',
      props: {
        min: 0.2,
        step: 0.1,
        style: { width: '100%' }
      },
    },
    color: {
      type: 'string',
      title: '颜色',
      componentType: 'ColorPicker',
      props: {
        showText: true,
        presets: COLOR_PRESETS,
      },
    },
    outlineColor: {
      type: 'string',
      title: "轮廓颜色",
      componentType: "ColorPicker",
      props: {
        showText: true,
        presets: COLOR_PRESETS,
      },
    },
    outlineWidth: {
      type: 'number',
      title: "轮廓线宽",
      componentType: "InputNumber",
      props: {
        min: 0,
        step: 0.01,
        max: 0.1,
        style: { width: '100%' }
      },
    },
    lineHeight: {
      type: 'number',
      title: '行高',
      componentType: 'InputNumber',
      props: {
        min: 0.2,
        step: 0.5,
        style: { width: '100%' }
      },
    },
    ...unitPostSchema.properties,
  }
} as Schema;