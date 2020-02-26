import * as React from 'react';
import { createStore } from 'typeRedux';
import { createInitState } from '@/canvaStore/state';
import * as reducers from '@/canvaStore/reducer';
import { EventCollect, IEvtEmit } from '@/EventCollect';
import { GlobalStore } from '@/GlobalStore';
import { FeatureMutater } from '@/featureMutater';

import { Provider } from 'dnd';
import { createFtrSubscribe } from '@/featureMutater/useFtrSubscribe';

export const Context = React.createContext({
  globalStore: {} as GlobalStore,
  evtEmit: {} as IEvtEmit,
  useFtrSubscribe: {} as ReturnType<typeof createFtrSubscribe>
});

export type ICtxValue = IGrag.IReactCtxValue<typeof Context>;

export function GragProvider(props: React.Props<any>) {
  const globalStore = React.useRef(new GlobalStore());
  const canvaStore = React.useRef(createStore(createInitState(), reducers));
  const featureMutater = React.useRef(new FeatureMutater(globalStore.current, canvaStore.current));
  const useFtrSubscribe = React.useRef(createFtrSubscribe(featureMutater.current));
  const evtCollect = React.useRef(new EventCollect(
    featureMutater.current.mutate,
    globalStore.current,
    canvaStore.current
  ));

  // debug
  if (process.env.NODE_ENV === 'development') {
    (window as any).__canvaStore = canvaStore.current;
    (window as any).__globalStore = globalStore.current;
    (window as any).__featureMutater = featureMutater.current;
    (window as any).__evtCollect = evtCollect.current;
  }

  return (
    <Context.Provider value={{
      globalStore: globalStore.current,
      evtEmit: evtCollect.current.emit,
      useFtrSubscribe: useFtrSubscribe.current
    }}>
      <Provider>
        {props.children}
      </Provider>
    </Context.Provider>
  );
}
