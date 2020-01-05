import * as React from 'react';
import { DragElementWrapper, DragSourceOptions, useDrag } from 'react-dnd';
import { ItemTypes } from '../itemTypes';

interface IProps extends React.Props<any> {
  component: React.ReactElement | {};
  children: (ref: DragElementWrapper<DragSourceOptions>) => React.ReactNode;
}

export function Feature(props: IProps) {
  const [, drag] = useDrag({
    item: { type: ItemTypes.BOARD, component: props.component }
  });
  return props.children(drag) as React.ReactElement;
}
