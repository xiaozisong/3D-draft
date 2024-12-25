import SplitPane from "react-split-pane";
import styles from "./index.less";
import RightPanel from "./rightpanel";
import Scene from "./scene";
import SideMenu from "./sidemenu";
import useKeyPressEffect from "./useKeyPress";
import { HomeOutlined } from "@ant-design/icons";

export default function HomePage() {

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
