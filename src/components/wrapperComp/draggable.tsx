import { IDragItem } from '@/components/feature';
import { ItemTypes } from '@/lib/itemTypes';
import { IFtrCtx } from '@/lib/renderTree';
import { useDrop } from 'dnd';
import * as React from 'react';
import { IRegiserDom } from './captureDom';

interface IDropableProps extends React.Props<any>, IFtrCtx {
  registerDom: IRegiserDom;
  ftrId: string;
  idx: number;
}

export function Dropable(props: IDropableProps) {
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);
  const [, drop] = useDrop({
    accept: ItemTypes.CANVAS,
    drop(item: IDragItem, monitor) {
      if (monitor.didDrop()) {
        return;
      }
      props.evtEmit('ftrDrop', { compId: item.compId, parentFtrId: props.ftrId });
    },
    hover(_item: IDragItem, monitor) {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
      props.evtEmit('ftrHover', {
        targetFtrId: props.ftrId
      });
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
