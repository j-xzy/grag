import * as React from 'react';
import { IRegisterDom } from '@/hooks/useRegisterDom';
import { useInitial } from '@/hooks/useInitial';
import { useMount } from '@/hooks/useMount';

interface IDropableProps extends React.Props<any> {
  registerDom: IRegisterDom;
  ftrId: string;
  idx: number;
}

export function MouseEventCollect(props: IDropableProps) {
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);
  const handleClick = React.useCallback((e: Event) => {
    e.stopPropagation();
  }, []);

  useInitial(() => {
    props.registerDom(props.idx, (dom) => {
      domRef.current = dom;
      dom.addEventListener('click', handleClick);
    });
  });

  useMount(() => {
    return () => {
      domRef.current?.removeEventListener('click', handleClick);
      domRef.current = null;
    };
  });

  return props.children as React.ReactElement;
}