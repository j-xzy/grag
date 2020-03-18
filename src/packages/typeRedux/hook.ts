import * as React from 'react';
import { Store } from './createStore';
import { shallowEqual } from './shallowEqual';


export function createUseMappedState<S>(store: Store<S, any>) {
  return function useMappedCanvasState<R>(mappedState: ITypeRedux.IMappedStateFunc<S, R>) {
    const savedMappedState = React.useRef(mappedState);
    const [state, setState] = React.useState(savedMappedState.current(store.getState()));
    const lastState = React.useRef(state);

    const update = React.useCallback(() => {
      const nextState = savedMappedState.current(store.getState());
      if (!shallowEqual(nextState, lastState.current)) {
        setState(nextState);
      }
      lastState.current = nextState;
    }, []);

    React.useEffect(() => {
      savedMappedState.current = mappedState;
      update();
    }, [mappedState]);

    React.useEffect(() => {
      const unSubscribe = store.subscribe(update);
      return () => unSubscribe();
    }, []);

    return state;
  };
}
