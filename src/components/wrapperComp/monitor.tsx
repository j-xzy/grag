import * as React from 'react';
import { IRegisterDom } from '@/hooks/useRegisterDom';
import { useInitial } from '@/hooks/useInitial';
import { useMount } from '@/hooks/useMount';

interface IMonitorProps extends React.Props<any> {
  registerDom: IRegisterDom;
  ftrId: string;
  idx: number;
}

export function Monitor(props: IMonitorProps) {
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);

  useInitial(() => {
    props.registerDom(props.idx, (dom) => {
      domRef.current = dom;
    });
  });

  // useFtrSubscribe(props.ftrId, 'updatePosition', (coord: IGrag.IXYCoord) => {
  //   if (domRef.current) {
  //     domRef.current.style.left = coord.x;
  //     domRef.current.style.top = coord.y;
  //   }
  // });

  useMount(() => {
    return () => {
      domRef.current = null;
    };
  });

  return props.children as React.ReactElement;
}
