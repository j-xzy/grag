import * as React from 'react';
import { DragElementWrapper, DragSourceOptions, useDrag } from 'dnd';
import { Context } from '@/components/provider';
import { ItemTypes } from '@/lib/itemTypes';
import { uuid } from '@/lib/uuid';

interface IProps extends React.Props<any> {
  component: IGrag.ICompFcClass;
  id?: string;
  children: (ref: DragElementWrapper<DragSourceOptions>) => React.ReactNode;
}

export interface IDragItem {
  type: string;
  compId: string;
}

export function Feature(props: IProps) {
  const { compMap } = React.useContext(Context);
  let id = props.id ?? uuid();
  while (compMap[id]) {
    id = uuid();
  }
  compMap[id] = props.component;
  const [, drag] = useDrag({
    item: { type: ItemTypes.CANVAS, compId: id } as IDragItem
  });
  return props.children(drag) as React.ReactElement;
}
