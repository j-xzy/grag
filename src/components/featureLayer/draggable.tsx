import * as React from 'react';
import { Context } from '@/components/provider';
import { IDragItem } from '@/components/feature';
import { IRegisterDom } from '@/hooks/useRegisterDom';
import { ItemTypes } from '@/lib/itemTypes';
import { useDrop } from 'dnd';
import { useInitial } from '@/hooks/useInitial';

interface IDropableProps extends React.Props<any> {
  registerDom: IRegisterDom;
  ftrId: string;
  idx: number;
  option: IGrag.ICompOption;
}

export function Dropable(props: IDropableProps) {
  const { evtEmit } = React.useContext(Context);
  const [, drop] = useDrop({
    accept: ItemTypes.CANVAS,
    drop(item: IDragItem, monitor) {
      if (monitor.didDrop()) {
        return;
      }
      evtEmit('ftrDropEnd', { compId: item.compId, parentFtrId: props.ftrId });
    },
    hover(_: IDragItem, monitor) {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
      evtEmit('ftrHover', props.ftrId, monitor.getClientOffset()!);
    }
  });

  useInitial(() => {
    props.registerDom(props.idx, (dom) => {
      if (props.option.allowChild) {
        drop(dom);
      }
    });
  });

  return props.children as React.ReactElement;
}
