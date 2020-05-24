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
  canvasId: string;
}

export function MouseEventCollect(props: IProps) {
  const { ftrId, canvasId } = props;
  const { evtEmit } = React.useContext(Context);
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);

  const handleMousedown = React.useCallback((e: MouseEvent) => {
    evtEmit('ftrMousedown', { ftrId, canvasId, pos: { x: e.clientX, y: e.clientY } });
    e.stopPropagation();
  }, [ftrId, canvasId]);
  const handleMouseup = React.useCallback((e: Event) => {
    evtEmit('ftrMouseup');
    e.stopPropagation();
  }, []);
  const handleMouseover = React.useCallback((e: Event) => {
    evtEmit('ftrMouseover', props.ftrId);
    e.stopPropagation();
  }, []);
  const handleMouseleave = React.useCallback((e: Event) => {
    evtEmit('ftrMouseleave');
    e.stopPropagation();
  }, []);

  useInitial(() => {
    props.registerDom(props.idx, (dom) => {
      domRef.current = dom;
      if (!props.isRoot) {
        dom.addEventListener('mousedown', handleMousedown);
        dom.addEventListener('mouseup', handleMouseup);
        dom.addEventListener('mouseover', handleMouseover);
        dom.addEventListener('mouseleave', handleMouseleave);
      }
    });
  });

  useMount(() => {
    return () => {
      domRef.current?.removeEventListener('mousedown', handleMousedown);
      domRef.current?.removeEventListener('mouseup', handleMouseup);
      domRef.current?.removeEventListener('mouseover', handleMouseover);
      domRef.current?.removeEventListener('mouseleave', handleMouseleave);
      domRef.current = null;
    };
  });

  return props.children as React.ReactElement;
}
