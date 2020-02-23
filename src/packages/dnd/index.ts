import * as React from 'react';
import { DndProvider } from 'react-dnd';
import backend from 'react-dnd-html5-backend';

export { useDrag, useDrop } from 'react-dnd';

export function Provider(props: React.Props<any>) {
  return React.createElement(DndProvider, {
    backend
  }, props.children);
}
