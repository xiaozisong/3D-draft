import { memo } from "react";
import SplitPane from "react-split-pane";
import ElementList from "../elementlist";
import ProtoPanel from "../protopanel";
import styles from "./index.less";

const RightPanel = () => {
  return (
    <div className={styles.rightpanel}>
      <SplitPane 
        split='horizontal'
        minSize={100}
        defaultSize={'50%'}
        className={styles.splitpane}
      >
        <ElementList />
        <ProtoPanel />
      </SplitPane>
    </div>
  )
};

export default memo(RightPanel);