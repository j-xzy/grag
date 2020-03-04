import * as React from 'react';
import { IRegisterDom } from '@/hooks/useRegisterDom';
import { useInitial } from '@/hooks/useInitial';
import { Context } from '@/components/provider';
import { useMount } from '@/hooks/useMount';

interface IDomStyleProps extends React.Props<any> {
  registerDom: IRegisterDom;
  ftrId: string;
  idx: number;
  isRoot: boolean;
  canvasId: string;
}

export function DomDone(props: IDomStyleProps) {
  const { evtEmit } = React.useContext(Context);
  
  useInitial(() => {
    props.registerDom(props.idx, (dom) => {
      dom.style.position = 'absolute';
      dom.style.userSelect = 'none';
      dom.style.boxSizing = 'border-box';
      dom.setAttribute('ftrid', props.ftrId);
      evtEmit('ftrDomDone', {
        ftrId: props.ftrId,
        canvasId: props.canvasId,
        dom
      });
    });
  });

  useMount(() => {
    return () => {
      evtEmit('ftrUnmount', props.ftrId);
    };
  });

  return props.children as React.ReactElement;
}
