import { IDragItem } from '@/components/feature';
import { ItemTypes } from '@/lib/itemTypes';
import { IRenderTreeCtx } from '@/lib/renderTree';
import { useDrop } from 'dnd';
import * as React from 'react';
import { IRegiserDom } from './captureDom';

interface IDropableProps extends React.Props<any>, IRenderTreeCtx {
  registerDom: IRegiserDom;
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
      props.browserEvtEmit('drop', item.component);
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
