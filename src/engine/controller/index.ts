import { Render } from '../render';
import { Action } from "./action";
import { Data } from "./data";
import { Elements } from "./element";
import { Events } from "./event";
import { Post } from "./post";
import { Setting } from './setting';
export class Controller {
  // 元素管理器
  element: Elements;

  // 动作管理器
  action: Action;

  // 事件管理器
  event: Events;

  // 数据管理器
  data: Data;

  // 后处理管理器
  post: Post;

  // 设置管理器
  setting: Setting;

  constructor(private engine: Render) {
    this.setting = new Setting(engine);
    this.action = new Action(engine);
    this.event = new Events(engine);
    this.post = new Post(engine);
    this.data = new Data(engine);
    this.element = new Elements(this.engine)
    
    this.init();
  };

  init() {
    const me = this;
    queueMicrotask(function () {
      const scene = me.engine.sceneController.scene;
      scene.add(me.element)
    });
  };
};
