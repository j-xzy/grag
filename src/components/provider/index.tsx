import { Root, RootCompId } from '@/components/root';
import { Provider } from 'dnd';
import React from 'react';

export const Context = React.createContext({
  compMap: {} as IGrag.ICompMap
});

export function GragProvider(props: React.Props<any>) {
  const compMap = React.useRef({ [RootCompId]: Root } as IGrag.ICompMap);
  return (
    <Context.Provider value={{ compMap: compMap.current }}>
      <Provider >
        {props.children}
      </Provider>
    </Context.Provider>
  );
}
