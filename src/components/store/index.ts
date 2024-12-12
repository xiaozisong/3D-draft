import { EventEmitter } from 'events';

export type StateType = Record<string, any>;

export interface StateChangeParam<DataType> {
  prevState: DataType;
  nextState: DataType;
  diffState: Partial<DataType>;
}

export class Store<DataType extends StateType> extends EventEmitter {

  state: DataType;

  constructor(initialState: DataType = {} as DataType) {
    super();
    this.state = initialState;
  }

  // 获取状态
  getState(): DataType {
    return this.state;
  }

  // 更新状态并触发事件通知
  setState(newState: Partial<DataType>): void {
    const prevState = this.state;
    const nextState = { ...prevState, ...newState };

    const diffState = Object.keys(prevState).reduce((acc, key) => {
      if (prevState[key] !== nextState[key]) {
        acc[key] = nextState[key];
      }
      return acc;
    }, {} as Record<string, any>) as Partial<DataType>;

    this.state = nextState as DataType;

    this.emit('change', {
      prevState,
      nextState,
      diffState,
    });
  }
}


