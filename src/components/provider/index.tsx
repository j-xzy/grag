import * as React from 'react';
import { createStore, createUseMappedState, applyMiddleware } from 'typeRedux';
import { createInitState, reducers, IUseMappedState, ICanvasStore } from '@/canvaStore';
import { createGlobalMiddleware } from '@/canvaStore/middlewares/createGlobalMiddleware';
import { EventBus, IEvtEmit } from '@/EventBus';
import { GlobalStore } from '@/GlobalStore';
import { FeatureMutater } from '@/featureMutater';
import { Provider } from 'dnd';
import { createFtrSubscribe } from '@/featureMutater/useFtrSubscribe';
import { mergeDefaultConfig } from './config';

export const Context = React.createContext({
  globalStore: {} as GlobalStore,
  evtEmit: {} as IEvtEmit,
  useFtrSubscribe: {} as ReturnType<typeof createFtrSubscribe>,
  useMappedCanvasState: {} as IUseMappedState,
  subscribeCanvaStore: {} as ICanvasStore['subscribe']
});

export type ICtxValue = IGrag.IReactCtxValue<typeof Context>;

// export interface IProviderProps extends React.Props<>

export const GragProvider = React.forwardRef<IGrag.IGragInterface, React.Props<IGrag.IGragInterface> & IGrag.IProviderConfig>((props, ref) => {
  const globalStore = React.useRef(new GlobalStore());
  const canvaStore = React.useRef(createStore(
    createInitState(mergeDefaultConfig(props)), reducers,
    applyMiddleware(createGlobalMiddleware(globalStore.current)))
  );
  const useMappedCanvasState = React.useRef(createUseMappedState(canvaStore.current));
  const featureMutater = React.useRef(new FeatureMutater(globalStore.current, canvaStore.current));
  const useFtrSubscribe = React.useRef(createFtrSubscribe(featureMutater.current));
  const evtBus = React.useRef(new EventBus(
    featureMutater.current.mutate,
    globalStore.current,
    canvaStore.current
  ));
  const getCanvas = React.useCallback(() => {
    return {
      roots: globalStore.current.getStraightRoots(),
      styles: canvaStore.current.getState().ftrStyles
    };
  }, [globalStore, canvaStore]);

  const refCurrent = React.useMemo(() => ({
    getCanvas
  }), [getCanvas]);

  if (typeof ref === 'function') {
    ref(refCurrent);
  } else if (ref) {
    ref.current = refCurrent;
  }

  return (
    <Context.Provider value={{
      globalStore: globalStore.current,
      evtEmit: evtBus.current.emit,
      useFtrSubscribe: useFtrSubscribe.current,
      useMappedCanvasState: useMappedCanvasState.current,
      subscribeCanvaStore: canvaStore.current.subscribe
    }}>
      <Provider>
        {props?.children}
      </Provider>
    </Context.Provider>
  );
});
