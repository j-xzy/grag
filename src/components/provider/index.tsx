import { Provider } from 'dnd';
import React from 'react';

export function GragProvider(props: React.Props<any>) {
  return (
    <Provider >
      {props.children}
    </Provider>
  );
}
