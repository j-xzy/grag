import { useMount } from '@/hooks/useMount';
import { IFtrCtx } from '@/lib/renderTree';
import * as React from 'react';
import { IRegiserDom } from './captureDom';

interface IDropableProps extends React.Props<any>, IFtrCtx {
  registerDom: IRegiserDom;
  idx: number;
}

export function MouseEventCollect(props: IDropableProps) {
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);

  useMount(() => {
    function handleClick(e: Event) {
      e.stopPropagation();
    }

    const unSubscribe = props.registerDom((dom, idx) => {
      if (!domRef.current && props.idx === idx) {
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
