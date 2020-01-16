import { useMount } from '@/hooks/useMount';
import { IDispatch, IUseMappedState } from '@/store';
import * as React from 'react';
import { IRegiserDom } from './captureDom';

interface IDropableProps extends React.Props<any> {
  registerDom: IRegiserDom;
  dispatch: IDispatch;
  useMappedState: IUseMappedState;
  idx: number;
}

export function Monitor(props: IDropableProps) {
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
