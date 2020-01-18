import { CaptureDom, IChildrenCallbackParams } from '@/components/wrapperComp/captureDom';
import { Dropable } from '@/components/wrapperComp/draggable';
import { Memo } from '@/components/wrapperComp/memo';
import { MouseEventCollect } from '@/components/wrapperComp/mouseEventCollect';
import { IBrowserEvtEmit } from '@/eventMonitor';
import { IUseMappedState } from '@/store';
import * as React from 'react';

export interface IRenderTreeCtx {
  browserEvtEmit: IBrowserEvtEmit;
  useMappedState: IUseMappedState;
}

interface IParams extends IChildrenCallbackParams {
  idx: number;
}

export function renderTree(root: IGrag.INode | null, ctx: IRenderTreeCtx, params: IParams) {
  if (root === null) {
    return null;
  }
  const { component: Comp, children } = root;
  return (
    <Memo key={params.idx} x-children={children}>
      <MouseEventCollect {...ctx} idx={params.idx} registerDom={params.registerChildDom}>
        <Dropable {...ctx} idx={params.idx} registerDom={params.registerChildDom}>
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
        </Dropable>
      </MouseEventCollect>
    </Memo>
  );
}
