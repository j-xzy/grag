import * as React from 'react';
import { IRegiserParentMount } from '@/components/featureLayer/captureDom';
import { useInitial } from '@/hooks/useInitial';
import { useMount } from '@/hooks/useMount';
import { Context } from '@/components/provider';
import { useMutationObserver } from '@/hooks/useMutationObserver';

interface IProps {
  registerCanvasMount: IRegiserParentMount;
  id: string;
  children: any;
}

export function EventCollect(props: IProps) {
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);
  const { evtEmit } = React.useContext(Context);

  const observeAttrMuationRef = useMutationObserver(() => {
    evtEmit('canvasStyleChange', { canvasId: props.id });
  }, { attributeFilter: ['style'] });

  const handleMousemove = React.useCallback((e: MouseEvent) => {
    evtEmit('canvasMousemove', {
      coord: { x: e.clientX, y: e.clientY },
      canvasId: props.id
    });
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    evtEmit('canvasMouseEnter', { canvasId: props.id });
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    evtEmit('canvasMouseLeave', { canvasId: props.id });
  }, []);

  const handleMousedown = React.useCallback(() => {
    evtEmit('canvasMousedown', { canvasId: props.id });
  }, []);

  useInitial(() => {
    props.registerCanvasMount((dom) => {
      observeAttrMuationRef(dom);
      domRef.current = dom;
      domRef.current.addEventListener('mousemove', handleMousemove, true);
      domRef.current.addEventListener('mouseenter', handleMouseEnter, true);
      domRef.current.addEventListener('mouseleave', handleMouseLeave, true);
      domRef.current.addEventListener('mousedown', handleMousedown);

      evtEmit('canvasMount', { canvasId: props.id, dom: domRef.current! });
      // 初始时同步canvasRect
      evtEmit('canvasStyleChange', { canvasId: props.id });
    });
  });

  useMount(() => {
    return () => {
      evtEmit('canvasUnMount', { canvasId: props.id });
      domRef.current?.removeEventListener('mousemove', handleMousemove, true);
      domRef.current?.removeEventListener('mouseenter', handleMouseEnter, true);
      domRef.current?.removeEventListener('mouseleave', handleMouseLeave, true);
      domRef.current?.removeEventListener('mousedown', handleMousedown);
      domRef.current = null;
    };
  });

  return props.children;
}
