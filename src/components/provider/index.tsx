import * as React from 'react';
import { EventCollect, IEvtEmit } from '@/EventCollect';
import { CanvaStore } from '@/CanvaStore';
import { FeatureStore } from '@/FeatureStore';
import { Provider } from 'dnd';
import { RootCompId } from '@/components/root';
import { buildNode } from '@/lib/treeUtil';
import { useListener } from '@/hooks/useListener';
import { uuid } from '@/lib/uuid';

interface IRegisterCanvasParam {
  canvasId: string;
  forceUpdate: IGrag.IFunction;
}

export const Context = React.createContext({
  canvaStore: {} as CanvaStore,
  evtEmit: (() => { /** */ }) as IEvtEmit,
  registerCanvas: (() => { /** */ }) as (param: IRegisterCanvasParam) => void
});

export type ICtxValue = IGrag.IReactCtxValue<typeof Context>;

export function GragProvider(props: React.Props<any>) {
  const canvasForceUpdateMap = React.useRef({} as IGrag.IIndexable<IGrag.IFunction>);
  const refreshCanvas = React.useCallback((canvasId) => {
    canvasForceUpdateMap.current[canvasId].call(null);
  }, []);

  const ftrId2CanvasId = React.useRef({} as IGrag.IIndexable<string>);
  const canvaStore = React.useRef(new CanvaStore());

  const featureStore = React.useRef(new FeatureStore(
    canvaStore.current,
    ftrId2CanvasId.current, refreshCanvas
  ));
  const evtCollect = React.useRef(new EventCollect(featureStore.current.dispatch));

  const [, registerCanvas] = useListener((param: IRegisterCanvasParam) => {
    const ftrId = uuid();
    ftrId2CanvasId.current[ftrId] = param.canvasId;
    canvaStore.current.setRoot(param.canvasId, buildNode({
      compId: RootCompId,
      ftrId  
    }));
    canvasForceUpdateMap.current[param.canvasId] = param.forceUpdate;
  });

  // debug
  if (process.env.NODE_ENV === 'development') {
    (window as any).__featureStore = featureStore.current;
    (window as any).__evtCollect = evtCollect.current;
  }

  return (
    <Context.Provider value={{
      canvaStore: canvaStore.current,
      evtEmit: evtCollect.current.emit,
      registerCanvas,
    }}>
      <Provider>
        {props.children}
      </Provider>
    </Context.Provider>
  );
}
