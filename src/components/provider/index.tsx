import * as React from 'react';
import { Root, RootCompId, RootFtrId } from '@/components/root';
import { Provider } from 'dnd';

export const Context = React.createContext({
  compMap: {} as IGrag.ICompMap, // compId到react组件映射
  domMap: {} as IGrag.IDomMap // ftrId到dom的映射
});

export type ICtxValue = IGrag.IReactCtxValue<typeof Context>;

export function GragProvider(props: React.Props<any>) {
  const compMap = React.useRef({ [RootCompId]: Root } as IGrag.ICompMap);
  const domMap = React.useRef({ [RootFtrId]: null, canvas: null } as IGrag.IDomMap);

  // debug
  if (process.env.NODE_ENV === 'development') {
    (window as any).__compMap = compMap.current;
    (window as any).__domMap = domMap.current;
  }

  return (
    <Context.Provider value={{ compMap: compMap.current, domMap: domMap.current }}>
      <Provider>
        {props.children}
      </Provider>
    </Context.Provider>
  );
}
