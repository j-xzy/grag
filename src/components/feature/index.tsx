import * as React from 'react';
import { DragElementWrapper, DragSourceOptions, useDrag } from 'dnd';
import { Context } from '@/components/provider';
import { ItemTypes } from '@/lib/itemTypes';
import { uuid } from '@/lib/uuid';

interface IProps extends React.Props<any> {
  component: IGrag.ICompFcClass;
  allowChild?: boolean;
  id?: string;
  children: (ref: DragElementWrapper<DragSourceOptions>) => React.ReactNode;
}

export interface IDragItem {
  type: string;
  compId: string;
}

export function Feature(props: IProps) {
  const { canvaStore } = React.useContext(Context);
  const id = props.id ?? uuid();
  canvaStore.setCompInfo(id, {
    Component: props.component,
    option: {
      allowChild: props.allowChild ?? false
    }
  });
  const [, drag] = useDrag({
    item: { type: ItemTypes.CANVAS, compId: id } as IDragItem
  });
  return props.children(drag) as React.ReactElement;
}
