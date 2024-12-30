import { Store } from "@/components/store";
import { SettingStore } from "@/engine/interface/setting";
import { Render } from "@/engine/render";
import { Utils } from "@/engine/utils";
import { Line } from '../element/line';
import { pick, isEmpty } from "lodash";

export class Setting {
  initialData: SettingStore = {
    activeElementKeys: [],
    editbarPosition: { x: 0, y: 0 },
    editbarVisible: false,
    gridSize: 16,
    cameraType: 'orthographicCamera',
    // 轴侧显示
    isIsometricView: true,
  }

  store = new Store<SettingStore>(this.initialData);

  // 回灌时需要排除的字段
  applyKeys = ['gridSize'];

  constructor(private engine: Render) {

  }

  applySetting(settings: SettingStore) {
    const me = this;
    const data = pick(settings, this.applyKeys);
    me.store.setState(data);
    const entries = Object.entries(data);
    for(const [key, value] of entries) {
      me.changeSetting(key, value);
    }
  }

  changeSetting(type: string, value: any) {
    const me = this;
    me.store.setState({ [type]: value });
    if (type === 'gridSize') {
      me.engine.sceneController.updateGround(value);
    }
  }

  // 更新编辑栏位置
  updateEditBar() {
    const me = this;
    const activeElements = me.engine.controller.action.select.activeElements;
    if (isEmpty(activeElements) || activeElements.length > 1) { 
      this.store.setState({
        editbarPosition: { x: 0, y: 0 },
        editbarVisible: false
      })  
      return;
    }
    const activeElement = activeElements[0];
    const objectPosition = [activeElement.position.x, activeElement.position.y, activeElement.position.z]
    const editbarPosition = Utils.Math.getViewportPointByWorldPoint({
      camera: this.engine.cameraController.camera,
      renderer: this.engine.renderer,
      point: objectPosition,
    })
    this.store.setState({
      editbarPosition: editbarPosition,
      editbarVisible: !(activeElement instanceof Line)
    })
  }
}