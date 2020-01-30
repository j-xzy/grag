import * as React from 'react';
import { IFtrCtx } from '@/lib/renderTree';
import { IRegisterDom } from '@/hooks/useRegisterDom';
import { useMount } from '@/hooks/useMount';

interface IDropableProps extends React.Props<any>, IFtrCtx {
  registerDom: IRegisterDom;
  ftrId: string;
  idx: number;
}

export function MouseEventCollect(props: IDropableProps) {
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);

  useMount(() => {
    function handleClick(e: Event) {
      e.stopPropagation();
    }

    const unSubscribe = props.registerDom(props.idx, (dom) => {
      if (!domRef.current) {
        domRef.current = dom;
        dom.addEventListener('click', handleClick);
        unSubscribe();
      }
    });
    return () => {
      domRef.current?.removeEventListener('click', handleClick);
    };
  });
  return props.children as React.ReactElement;
}
