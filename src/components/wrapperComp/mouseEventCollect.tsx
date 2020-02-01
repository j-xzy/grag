import * as React from 'react';
import { IFtrCtx } from '@/lib/renderTree';
import { IRegisterDom } from '@/hooks/useRegisterDom';
import { useInitial } from '@/hooks/useInitial';
import { useMount } from '@/hooks/useMount';

interface IDropableProps extends React.Props<any>, IFtrCtx {
  registerDom: IRegisterDom;
  ftrId: string;
  idx: number;
}

export function MouseEventCollect(props: IDropableProps) {
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);
  const handleClick = React.useCallback((e: Event) => {
    e.stopPropagation();
  }, []);

  const unSubscribeRegisterDom = useInitial(() => {
    const unSubscribe = props.registerDom(props.idx, (dom) => {
      if (!domRef.current) {
        domRef.current = dom;
        dom.addEventListener('click', handleClick);
        unSubscribe();
      }
    });
    return unSubscribe;
  });

  useMount(() => {
    return () => {
      unSubscribeRegisterDom();
      domRef.current?.removeEventListener('click', handleClick);
      domRef.current = null;
    };
  });

  return props.children as React.ReactElement;
}
