import { useMount } from '@/hooks/useMount';
import { IDispatch, IUseMappedState } from '@/store';
import * as React from 'react';
import { IRegiserDom } from './captureDom';

interface IDropableProps extends React.Props<any> {
  registerDom: IRegiserDom;
  dispatch: IDispatch;
  useMappedState: IUseMappedState;
}

export function Monitor(props: IDropableProps) {
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);

  useMount(() => {
    function handleClick(e: Event) {
      e.stopPropagation();
    }

    props.registerDom((dom) => {
      domRef.current = dom;
      dom.addEventListener('click', handleClick);
    });
    return () => {
      domRef.current?.removeEventListener('click', handleClick);
    };
  });

  return props.children as React.ReactElement;
}
