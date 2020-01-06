import { IDomReadyCallback, IProps, WrapperComp } from '@/components/wrapperComp';
import * as React from 'react';

type ICtx = Omit<IProps, 'children' | 'domReady' | 'idx'>;

export function renderTree(root: IGrag.INode | null, ctx: ICtx, domReady: IDomReadyCallback, idx: number) {
  if (root === null) {
    return null;
  }
  const { component: Comp, children } = root;
  return (
    <WrapperComp {...ctx} idx={idx} key={idx} domReady={domReady}>
      {
        (ready) => (<Comp>{children.map((child, index) => renderTree(child, ctx, ready(index), index))}</Comp>)
      }
    </WrapperComp>
  );
}
