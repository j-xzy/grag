import { ItemTypes } from '@/lib/itemTypes';
import { DragElementWrapper, DragSourceOptions, useDrag } from 'dnd';
import * as React from 'react';

interface IProps extends React.Props<any> {
  component: IGrag.ICompFcClass;
  children: (ref: DragElementWrapper<DragSourceOptions>) => React.ReactNode;
}

export function Feature(props: IProps) {
  const [, drag] = useDrag({
    item: { type: ItemTypes.CANVAS, component: props.component }
  });
  return props.children(drag) as React.ReactElement;
}
