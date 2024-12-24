import { Store } from "@/components/store";
import { SettingStore } from "@/engine/interface/setting";
import { Render } from "@/engine/render";
import { Utils } from "@/engine/utils";
import { Line } from '../element/line';


export class Setting {
  initialData: SettingStore = {
    activeElementKeys: [],
    editbarPosition: { x: 0, y: 0 },
    editbarVisible: false,
    gridSize: 16,
  }

  store = new Store<SettingStore>(this.initialData)

  constructor(private engine: Render) {

  }

  applySetting(settings: SettingStore) {
    const me = this;
    me.store.setState(settings);
    const entries = Object.entries(settings);
    for(const [key, value] of entries) {
      me.changeSetting(key, value);
    }
  }

  changeSetting(type: string, value: any) {
    const me = this;
    if (type === 'gridSize') {
      me.engine.sceneController.updateGround(value);
    }
    me.store.setState({ [type]: value });
  }

  // 更新编辑栏位置
  updateEditBar() {
    const me = this;
    const activeElement = me.engine.controller.action.select.activeElement;
    if (!activeElement) { 
      this.store.setState({
        editbarPosition: { x: 0, y: 0 },
        editbarVisible: false
      })  
      return;
    }
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