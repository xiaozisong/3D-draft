import styles from "./index.less";
import { Typography } from "antd";
const { Title } = Typography;
import SideMenu from "./sidemenu";
import Scene from "./scene";
import ProtoPanel from "./protopanel";
import { engine } from "../engine";
import useKeyPressEffect from "./useKeyPress";

export default function HomePage() {
  console.log('engine',engine)
  useKeyPressEffect();

  return (
    <div className={styles.container}>
      {/* 侧边栏 */}
      <SideMenu /> 
      {/* 渲染场景 */}
      <Scene />
      {/* 物体原型面板 -- 后续补 */}
      <ProtoPanel />
    </div>
  );
}
