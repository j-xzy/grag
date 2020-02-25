import * as React from 'react';
import { IRegisterDom } from '@/hooks/useRegisterDom';
import { useInitial } from '@/hooks/useInitial';
import { useMount } from '@/hooks/useMount';
import { Context } from '@/components/provider';

interface IMonitorProps extends React.Props<any> {
  registerDom: IRegisterDom;
  ftrId: string;
  idx: number;
  isRoot: boolean;
}

export function Monitor(props: IMonitorProps) {
  const { useFtrSubscribe } = React.useContext(Context);
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);

  useInitial(() => {
    props.registerDom(props.idx, (dom) => {
      domRef.current = dom;
      if (!props.isRoot) {
        domRef.current.style.position = 'absolute';
      }
    });
  });

  useFtrSubscribe(props.ftrId, 'updateCoord', (coord) => {
    if (domRef.current && !props.isRoot) {
      domRef.current.style.left = coord.x + 'px';
      domRef.current.style.top = coord.y + 'px';
    }
  });

  useMount(() => {
    return () => {
      domRef.current = null;
    };
  });

  return props.children as React.ReactElement;
}
