import styles from "./index.less";
import { Typography } from "antd";
import SideMenu from "./sidemenu";
import Scene from "./scene";
import ProtoPanel from "./protopanel";
import { useEngine } from "../engine";
import useKeyPressEffect from "./useKeyPress";
import { useStore } from "@/components/store/useStore";
import { isEmpty } from "lodash";
import RightPanel from "./rightpanel";
import SplitPane from "react-split-pane";
const { Title } = Typography;

export default function HomePage() {

  const engine = useEngine();
  const [{ activeElementKeys }] = useStore(engine.controller.setting.store, ["activeElementKeys"]);

  useKeyPressEffect();

  return (
    <div className={styles.container}>
      {/* 侧边栏 */}
      <SideMenu />
      <div className={styles.main}>
        <SplitPane
          split='vertical'
          minSize={0}
          maxSize={-1}
          defaultSize='80%'
          onChange={() => {
            window.dispatchEvent(new Event('resize'));
          }}
        >
          {/* 渲染场景 */}
          <Scene />
          {/* 物体原型面板 -- 后续补 */}
          <RightPanel />
        </SplitPane>
      </div>
    </div>
  );
}
