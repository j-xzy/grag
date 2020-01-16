import { CaptureDom, IChildrenCallbackParams } from '@/components/wrapperComp/captureDom';
import { Dropable } from '@/components/wrapperComp/draggable';
import { Monitor } from '@/components/wrapperComp/monitor';
import { IDispatch, IUseMappedState } from '@/store';
import * as React from 'react';

interface ICtx {
  dispatch: IDispatch;
  useMappedState: IUseMappedState;
}

interface IParams extends IChildrenCallbackParams {
  idx: number;
}

export function renderTree(root: IGrag.INode | null, ctx: ICtx, params: IParams) {
  if (root === null) {
    return null;
  }
  const { component: Comp, children } = root;
  return (
    <Dropable {...ctx} idx={params.idx} key={params.idx} registerDom={params.registerChildDom}>
      <Monitor {...ctx} idx={params.idx} registerDom={params.registerChildDom}>
        <CaptureDom
          {...ctx}
          idx={params.idx}
          parentIsMount={params.parentIsMount}
          registerParentMount={params.registerParentMount}
          registerDom={params.registerChildDom}
        >
          {
            ({ registerChildDom, registerParentMount, parentIsMount }) => (
              <Comp>
                {
                  children.length ?
                    children.map((child, idx) => renderTree(child, ctx, { registerChildDom, idx, registerParentMount, parentIsMount }))
                    : null
                }
              </Comp>
            )
          }
        </CaptureDom>
      </Monitor>
    </Dropable>
  );
}
