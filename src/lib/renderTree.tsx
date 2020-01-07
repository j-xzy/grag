import { IRegiserDom, IRegiserParentMount, WrapperComp } from '@/components/wrapperComp';
import { IDispatch, IUseMappedState } from '@/store';
import * as React from 'react';

interface ICtx {
  dispatch: IDispatch;
  useMappedState: IUseMappedState;
}

interface IParams {
  registerParentMount: IRegiserParentMount;
  registerDom: IRegiserDom;
  idx: number;
}

export function renderTree(root: IGrag.INode | null, ctx: ICtx, params: IParams) {
  if (root === null) {
    return null;
  }
  const { component: Comp, children } = root;
  return (
    <WrapperComp {...ctx} idx={params.idx} key={params.idx} registerParentMount={params.registerParentMount} registerDom={params.registerDom} >
      {
        (registerDom, registerParentMount) => (
          <Comp>
            {
              children.map((child, idx) => renderTree(child, ctx, { registerDom, idx, registerParentMount }))
            }
          </Comp>
        )
      }
    </WrapperComp>
  );
}
