import * as React from 'react';
import { IRegisterDom } from '@/hooks/useRegisterDom';
import { useInitial } from '@/hooks/useInitial';

interface IDomStyleProps extends React.Props<any> {
  registerDom: IRegisterDom;
  ftrId: string;
  idx: number;
  isRoot: boolean;
}

export function DomStyle(props: IDomStyleProps) {
  useInitial(() => {
    props.registerDom(props.idx, (dom) => {
      if (!props.isRoot) {
        dom.style.position = 'absolute';
      }
      dom.style.userSelect = 'none';
      dom.setAttribute('ftrid', props.ftrId);
    });
  });

  return props.children as React.ReactElement;
}
