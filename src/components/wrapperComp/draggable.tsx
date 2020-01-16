import { IDragItem } from '@/components/feature';
import { ItemTypes } from '@/lib/itemTypes';
import { IDispatch, IUseMappedState } from '@/store';
import { useDrop } from 'dnd';
import * as React from 'react';
import { IRegiserDom } from './captureDom';

interface IDropableProps extends React.Props<any> {
  registerDom: IRegiserDom;
  dispatch: IDispatch;
  useMappedState: IUseMappedState;
  idx: number;
}

export function Dropable(props: IDropableProps) {
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);
  const [, drop] = useDrop({
    accept: ItemTypes.CANVAS,
    drop: (item: IDragItem, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      props.dispatch('beforeDrop', item.component);
    }
  });

  React.useEffect(() => {
    const unSubscribe = props.registerDom((dom, idx) => {
      if (!domRef.current && idx === props.idx) {
        domRef.current = dom;
        drop(dom);
        unSubscribe();
      }
    });
  }, [props.registerDom]);

  return props.children as React.ReactElement;
}
