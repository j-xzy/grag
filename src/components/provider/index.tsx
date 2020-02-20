import * as React from 'react';
import { EventCollect, IEvtEmit } from '@/EventCollect';
import { Root, RootCompId } from '@/components/root';
import { Provider } from 'dnd';

export const Context = React.createContext({
  compMap: {} as IGrag.ICompMap, // compId到react组件映射
  domMap: {} as IGrag.IDomMap, // ftrId到dom的映射
  rootMap: {} as { [canvsaId: string]: IGrag.INode }, // canvasId到root的映射
  evtEmit: (() => { /** */ }) as IEvtEmit
});

export type ICtxValue = IGrag.IReactCtxValue<typeof Context>;

export function GragProvider(props: React.Props<any>) {
  const compMap = React.useRef({ [RootCompId]: Root } as IGrag.ICompMap);
  const domMap = React.useRef({} as IGrag.IDomMap);
  const rootMap = React.useRef({} as { [canvsaId: string]: IGrag.INode });
  const evtCollect = React.useRef(new EventCollect());

  // debug
  if (process.env.NODE_ENV === 'development') {
    (window as any).__compMap = compMap.current;
    (window as any).__domMap = domMap.current;
    (window as any).__rootMap = rootMap.current;
    (window as any).__evtCollect = evtCollect.current;
  }

  return (
    <Context.Provider value={{
      compMap: compMap.current,
      domMap: domMap.current,
      evtEmit: evtCollect.current.emit,
      rootMap: rootMap.current,
    }}>
      <Provider>
        {props.children}
      </Provider>
    </Context.Provider>
  );
}
