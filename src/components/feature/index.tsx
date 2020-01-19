import { Context } from '@/components/provider';
import { ItemTypes } from '@/lib/itemTypes';
import { uuid } from '@/lib/uuid';
import { DragElementWrapper, DragSourceOptions, useDrag } from 'dnd';
import * as React from 'react';

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
  const { id2CompMap } = React.useContext(Context);
  let id = props.id ?? uuid();
  while (id2CompMap[id]) {
    id = uuid();
  }
  id2CompMap[id] = props.component;
  const [, drag] = useDrag({
    item: { type: ItemTypes.CANVAS, compId: id } as IDragItem
  });
  return props.children(drag) as React.ReactElement;
}
