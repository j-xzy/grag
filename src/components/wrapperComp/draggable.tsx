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
}

export function Dropable(props: IDropableProps) {
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);
  const [, drop] = useDrop({
    accept: ItemTypes.CANVAS,
    drop: (_item: IDragItem, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      props.dispatch('beforeDrop');
    }
  });

  React.useEffect(() => {
    props.registerDom((dom) => {
      drop(dom);
      domRef.current = dom;
    });
  }, [props.registerDom]);

  return props.children as React.ReactElement;
}
