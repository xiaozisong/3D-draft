import { ColorPicker as AntColorPicker, ColorPickerProps as AntColorPickerProps } from "antd";
import { Color } from "antd/es/color-picker";
import { useCallback } from "react";

export interface ColorPickerProps extends Omit<AntColorPickerProps, "onChange"> {
  // 改写onChange类型为(color: string) => void
  onChange: (color: string) => void;
}

const ColorPicker = (props: ColorPickerProps) => {
  const { onChange, ...restProps } = props;

  // 只在颜色选择完成时回调 onChange
  const onChangeComplete = useCallback((value: Color) => {
    if (onChange) {
      onChange(value.toHexString());
    }
  }, []);

  return (
    <AntColorPicker
      {...restProps}
      onChangeComplete={onChangeComplete}
    />
  );
};

export default ColorPicker;