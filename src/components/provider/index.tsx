import { Root, RootCompId } from '@/components/root';
import { Provider } from 'dnd';
import React from 'react';

export const Context = React.createContext({
  id2CompMap: {} as IGrag.IId2CompMap
});

export function GragProvider(props: React.Props<any>) {
  const id2CompMap = React.useRef({ [RootCompId]: Root } as IGrag.IId2CompMap);
  return (
    <Context.Provider value={{ id2CompMap: id2CompMap.current }}>
      <Provider >
        {props.children}
      </Provider>
    </Context.Provider>
  );
}
