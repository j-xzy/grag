import * as React from 'react';
import { createStore } from 'typeRedux';
import { createInitState } from '@/canvaStore/state';
import * as reducers from '@/canvaStore/reducer';
import { EventCollect, IEvtEmit } from '@/EventCollect';
import { ProviderStore } from '@/ProviderStore';
import { FeatureStore } from '@/FeatureStore';

import { Provider } from 'dnd';
import { createFtrSubscribe } from '@/featureStore/useFtrSubscribe';

export const Context = React.createContext({
  providerStore: {} as ProviderStore,
  evtEmit: {} as IEvtEmit,
  useFtrSubscribe: {} as ReturnType<typeof createFtrSubscribe>
});

export type ICtxValue = IGrag.IReactCtxValue<typeof Context>;

export function GragProvider(props: React.Props<any>) {
  const canvaStore = React.useRef(createStore(createInitState(), reducers));
  const providerStore = React.useRef(new ProviderStore());
  const featureStore = React.useRef(new FeatureStore(providerStore.current));
  const useFtrSubscribe = React.useRef(createFtrSubscribe(featureStore.current));
  const evtCollect = React.useRef(new EventCollect(
    featureStore.current.dispatch,
    providerStore.current,
    canvaStore.current
  ));

  // debug
  if (process.env.NODE_ENV === 'development') {
    (window as any).__canvaStore = canvaStore.current;
    (window as any).__providerStore = providerStore.current;
    (window as any).__featureStore = featureStore.current;
    (window as any).__evtCollect = evtCollect.current;
  }

  return (
    <Context.Provider value={{
      providerStore: providerStore.current,
      evtEmit: evtCollect.current.emit,
      useFtrSubscribe: useFtrSubscribe.current
    }}>
      <Provider>
        {props.children}
      </Provider>
    </Context.Provider>
  );
}
