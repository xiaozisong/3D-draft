import { Link, Outlet } from "umi";
import styles from "./index.less";
import "./global.less";
import { Button } from "antd";
import { CodepenOutlined, PoweroffOutlined, SaveOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { useEngine } from "@/engine";
import { init, animate } from "./demo";

export default function Layout() {
  useLayoutEffect(() => {
    init();
    animate();
  }, []);
  return null;
}
