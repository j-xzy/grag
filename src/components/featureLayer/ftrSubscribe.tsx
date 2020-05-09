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

export function FtrSubscribe(props: IMonitorProps) {
  const { useFtrSubscribe } = React.useContext(Context);
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);

  useInitial(() => {
    props.registerDom(props.idx, (dom) => {
      domRef.current = dom;
    });
  });

  useFtrSubscribe(props.ftrId, 'updateStyle', (style) => {
    if (domRef.current) {
      domRef.current.style.left = style.x + 'px';
      domRef.current.style.top = style.y + 'px';
      domRef.current.style.width = style.width + 'px';
      domRef.current.style.height = style.height + 'px';
      domRef.current.style.transform = `rotate(${style.rotate}deg)`;
    }
  });

  useMount(() => {
    return () => {
      domRef.current = null;
    };
  });

  return props.children as React.ReactElement;
}
