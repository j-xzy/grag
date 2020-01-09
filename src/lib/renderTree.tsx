import { CaptureDom, IRegiserDom, IRegiserParentMount } from '@/components/wrapperComp/captureDom';
import { Dropable } from '@/components/wrapperComp/draggable';
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
    <Dropable key={params.idx} registerDom={params.registerDom}>
      <CaptureDom {...ctx} idx={params.idx} registerParentMount={params.registerParentMount} registerDom={params.registerDom} >
        {
          (registerDom, registerParentMount) => (
            <Comp>
              {
                children.map((child, idx) => renderTree(child, ctx, { registerDom, idx, registerParentMount }))
              }
            </Comp>
          )
        }
      </CaptureDom>
    </Dropable>
  );
}
