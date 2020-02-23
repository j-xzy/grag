import * as React from 'react';
import { EventCollect, IEvtEmit } from '@/EventCollect';
import { CanvaStore } from '@/CanvaStore';
import { FeatureStore } from '@/FeatureStore';
import { Provider } from 'dnd';

export const Context = React.createContext({
  canvaStore: {} as CanvaStore,
  evtEmit: {} as IEvtEmit
});

export type ICtxValue = IGrag.IReactCtxValue<typeof Context>;

export function GragProvider(props: React.Props<any>) {
  const canvaStore = React.useRef(new CanvaStore());
  const featureStore = React.useRef(new FeatureStore(canvaStore.current));
  const evtCollect = React.useRef(new EventCollect(featureStore.current.dispatch));

  // debug
  if (process.env.NODE_ENV === 'development') {
    (window as any).__canvaStore = canvaStore.current;
    (window as any).__featureStore = featureStore.current;
    (window as any).__evtCollect = evtCollect.current;
  }

  return (
    <Context.Provider value={{
      canvaStore: canvaStore.current,
      evtEmit: evtCollect.current.emit
    }}>
      <Provider>
        {props.children}
      </Provider>
    </Context.Provider>
  );
}
