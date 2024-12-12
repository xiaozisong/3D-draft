import { useState, useEffect } from 'react';
import { StateChangeParam, StateType, Store } from './';
import { PickMultiple } from '@/engine/interface/utils';


export function useStore<
  DataType extends StateType,
  Keys extends keyof DataType = keyof DataType
>(
  store: Store<DataType>,
  keys?: Keys[] | Keys
): [Pick<DataType, Keys>, (newState: Partial<DataType>) => void] {

  const [state, setState] = useState<DataType>(store.getState());

  const updateState = (newState: Partial<DataType>) => {
    store.setState(newState);
  };

  useEffect(() => {
    const handleChange = ({
      nextState,
    }: StateChangeParam<DataType>) => {
      setState(nextState);
    };
    store.on('change', handleChange);
    return () => {
      store.off('change', handleChange);
    };
  }, [store]);

  if (!keys) {
    return [state, updateState];
  }

  const selectedState = {} as Pick<DataType, Keys>

  if (typeof keys === 'string') {
    selectedState[keys] = state[keys];
  } else if (Array.isArray(keys)) {
    keys.forEach(key => {
      selectedState[key] = state[key];
    });
  }

  return [selectedState as Pick<DataType, Keys>, updateState]
}


