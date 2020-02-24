import * as React from 'react';
import { EventCollect, IEvtEmit } from '@/EventCollect';
import { ProviderStore } from '@/ProviderStore';
import { FeatureStore } from '@/FeatureStore';
import { Provider } from 'dnd';

export const Context = React.createContext({
  providerStore: {} as ProviderStore,
  evtEmit: {} as IEvtEmit
});

export type ICtxValue = IGrag.IReactCtxValue<typeof Context>;

export function GragProvider(props: React.Props<any>) {
  const providerStore = React.useRef(new ProviderStore());
  const featureStore = React.useRef(new FeatureStore(providerStore.current));
  const evtCollect = React.useRef(new EventCollect(featureStore.current.dispatch, providerStore.current));

  // debug
  if (process.env.NODE_ENV === 'development') {
    (window as any).__canvaStore = providerStore.current;
    (window as any).__featureStore = featureStore.current;
    (window as any).__evtCollect = evtCollect.current;
  }

  return (
    <Context.Provider value={{
      providerStore: providerStore.current,
      evtEmit: evtCollect.current.emit
    }}>
      <Provider>
        {props.children}
      </Provider>
    </Context.Provider>
  );
}
