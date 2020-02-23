import * as React from 'react';
import { Context } from '@/components/provider';
import { IDragItem } from '@/components/feature';
import { IRegisterDom } from '@/hooks/useRegisterDom';
import { ItemTypes } from '@/lib/itemTypes';
import { useDrop } from 'dnd';
import { useInitial } from '@/hooks/useInitial';
import { useMount } from '@/hooks/useMount';

interface IDropableProps extends React.Props<any> {
  registerDom: IRegisterDom;
  ftrId: string;
  idx: number;
  option: IGrag.ICompOption;
}

export function Dropable(props: IDropableProps) {
  const { evtEmit } = React.useContext(Context);
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);
  const [, drop] = useDrop({
    accept: ItemTypes.CANVAS,
    drop(item: IDragItem, monitor) {
      if (monitor.didDrop()) {
        return;
      }
      evtEmit('ftrDrop', { compId: item.compId, parentFtrId: props.ftrId });
    },
    hover(_: IDragItem, monitor) {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
      evtEmit('ftrHover', {
        ftrId: props.ftrId,
        clientOffset: monitor.getClientOffset()!
      });
    }
  });

  useInitial(() => {
    props.registerDom(props.idx, (dom) => {
      if (!domRef.current) {
        domRef.current = dom;
        if (props.option.allowChild) {
          drop(dom);
        }
      }
    });
  });

  useMount(() => {
    return () => {
      domRef.current = null;
    };
  });

  return props.children as React.ReactElement;
}
