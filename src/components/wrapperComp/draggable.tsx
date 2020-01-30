import * as React from 'react';
import { IDragItem } from '@/components/feature';
import { IFtrCtx } from '@/lib/renderTree';
import { IRegisterDom } from '@/hooks/useRegisterDom';
import { ItemTypes } from '@/lib/itemTypes';
import { useDrop } from 'dnd';
import { useMount } from '@/hooks/useMount';

interface IDropableProps extends React.Props<any>, IFtrCtx {
  registerDom: IRegisterDom;
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

  useMount(() => {
    const unSubscribe = props.registerDom(props.idx, (dom) => {
      if (!domRef.current) {
        domRef.current = dom;
        drop(dom);
        unSubscribe();
      }
    });
  });

  return props.children as React.ReactElement;
}
