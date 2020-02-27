import * as React from 'react';
import { IRegisterDom } from '@/hooks/useRegisterDom';
import { useInitial } from '@/hooks/useInitial';
import { useMount } from '@/hooks/useMount';
import { Context } from '@/components/provider';

interface IProps extends React.Props<any> {
  registerDom: IRegisterDom;
  ftrId: string;
  idx: number;
  isRoot: boolean;
}

export function MouseEventCollect(props: IProps) {
  const { evtEmit } = React.useContext(Context);
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);

  const handleMousedown = React.useCallback((e: Event) => {
    evtEmit('ftrMousedown', {ftrId: props.ftrId});
    e.stopPropagation();
  }, []);
  const handleMouseup =  React.useCallback((e: Event) => {
    evtEmit('ftrMouseup', {ftrId: props.ftrId});
    e.stopPropagation();
  }, []);

  useInitial(() => {
    props.registerDom(props.idx, (dom) => {
      domRef.current = dom;
      if (!props.isRoot) {
        dom.addEventListener('mousedown', handleMousedown);
        dom.addEventListener('mouseup', handleMouseup);
      }
    });
  });

  useMount(() => {
    return () => {
      domRef.current?.removeEventListener('mousedown', handleMousedown);
      domRef.current?.removeEventListener('mouseup', handleMouseup);
      domRef.current = null;
    };
  });

  return props.children as React.ReactElement;
}
