import { Select, SelectProps, Space } from "antd";
import { useCallback } from "react";
import { useAsync } from "react-use";
import DynamicSvgIcon from "../dynamicsvgicon";
import { BaseOptionType, DefaultOptionType } from "antd/es/select";
import styles from "./index.less";

export interface IconSelectProps extends SelectProps {
  url: string;
}

const iconDir = "icon/ant-icon-filled";
const iconNameFile = `${iconDir}/0.name.json`;

const IconSelect = (props: IconSelectProps) => {
  const { url, ...restProps } = props;

  const { value: options, loading } = useAsync(async () => {
    const response = await fetch(iconNameFile);
    const names = await response.json();
    const result = names.map((name: string) => ({
      label: name,
      value: name,
    }));
    return result;
  }, []);

  const optionsRender = useCallback((option: BaseOptionType) => {
    return (
      <Space>
        <span>
          <DynamicSvgIcon 
            svgPath={`${iconDir}/${option.value}.svg`}
            size={22}
          />
        </span>
        {option.value}
      </Space>
    );
  }, []);
  
  const filterOption = (input: string, option?: DefaultOptionType): boolean => {
    if (String(option?.label)?.toLowerCase()?.includes(input.toLowerCase())) {
      return true;
    }
    return false;
  }

  return (
    <Select 
      {...restProps}
      options={options}
      loading={loading}
      optionRender={optionsRender}
      popupClassName={styles.popup}
      filterOption={filterOption}
      showSearch
    />
  );
};

export default IconSelect;