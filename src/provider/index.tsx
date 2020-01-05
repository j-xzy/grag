import React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

export function BoradProvider(props: React.Props<any>) {
  return (
    <DndProvider backend={Backend}>
      {props.children}
    </DndProvider>
  );
}
