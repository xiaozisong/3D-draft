import { Link, Outlet } from "umi";
import styles from "./index.less";
import "./global.less";
import { Button } from "antd";
import { CodepenOutlined, PoweroffOutlined, SaveOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { useEngine } from "@/engine";
import { init, animate } from "./demo";
import { Store } from "@/components/store";
import { useStore } from "@/components/store/useStore";
import { PickMultiple } from "@/engine/interface/utils";

interface IData {
  count: number;
  a: string;
  b: string;
}

// 创建存储实例
export const store = new Store<IData>({ count: 0, a: "a", b: "b" });

export default function Layout() {
  const [state, setState] = useStore<IData>(store, ["a", "count"]);

  const { count, a } = state;
  // useLayoutEffect(() => {
  //   // init();
  //   // animate();
  //   console.log(count, a);

  //   // 订阅数据变化
  //   // store.on("change", (state) => {
  //   //   console.log("State changed:", state);
  //   // });

  //   // // 更新状态并触发事件
  //   // store.setState({ count: 1 });
  //   // store.setState({ count: 2 });
  // }, []);

  console.log("state", state);
  useEffect(() => {
    console.log("count changed:", count, a);
  }, [a]);

  return (
    <div
      onClick={() => {
        setState({ count: count + 1 });
      }}
    >
      click
    </div>
  );
}
