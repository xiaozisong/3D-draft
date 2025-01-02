import styles from "./index.less";
import { Collapse, CollapseProps, Input, List, Typography } from "antd";
import ElementList from "./list";
const { Title } = Typography;

const { Search } = Input;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const data = [
  {
    key: "cube",
    name: "立方体",
  },
  {
    key: "cylinder",
    name: "棱柱体",
  },
  {
    key: "text",
    name: "文字",
  },
  {
    key: "area",
    name: "平面",
  },
  {
    key: "icon",
    name: "图标",
  },
  // {
  //   key: "line",
  //   name: "线条",
  // },
  // {
  //   key: "image",
  //   name: "图片",
  // },
];

const dataAdvanced = [
  {
    key: "model",
    name: "模型",
  },
];

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "通用",
    children: <ElementList data={data} />,
  },
  {
    key: "2",
    label: "高级",
    children: <ElementList data={dataAdvanced} />,
  },
];

export default function HomePage() {
  return (
    <div className={styles.left}>
      <div className={styles.header}>
        {/* <div className={styles.title}> */}
          <Title level={5}>物体</Title>
        {/* </div> */}
        <div className={styles.search}>
          <Search
            placeholder='搜索'
            // onSearch={onSearch}
            // style={{ width: 200 }}
          />
        </div>
      </div>
      <div className={styles.objectList}>
        <Collapse
          items={items}
          defaultActiveKey={["1"]}
          size='small'
          expandIconPosition='end'
          // onChange={onChange}
        />
      </div>
    </div>
  );
}
