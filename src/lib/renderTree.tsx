import * as React from 'react';
import { CaptureDom, ICaptureDomParams } from '@/components/wrapperComp/captureDom';
import { Dropable } from '@/components/wrapperComp/draggable';
import { IEvtEmit } from '@/eventMonitor';
import { IUseMappedState } from '@/store';
import { MemoNode } from '@/components/wrapperComp/memoNode';
import { MouseEventCollect } from '@/components/wrapperComp/mouseEventCollect';

export interface IFtrCtx {
  evtEmit: IEvtEmit;
  useMappedState: IUseMappedState;
}

interface IParams extends ICaptureDomParams {
  idx: number;
}

interface IRenderTreeProps {
  root: IGrag.INode | null;
  compMap: IGrag.ICompMap;
  ftrCtx: IFtrCtx;
  captureDomParams: IParams;
}

export function renderTree(renderTreeparams: IRenderTreeProps) {
  const { compMap, root, ftrCtx, captureDomParams } = renderTreeparams;
  return renderNode(root, captureDomParams);

  function renderNode(node: IGrag.INode | null, params: IParams) {
    if (node === null) {
      return null;
    }
    const { compId, children, ftrId } = node;
    const Comp = compMap[compId];
    return (
      <MemoNode key={ftrId} node={node}>
        <MouseEventCollect {...ftrCtx} ftrId={ftrId} idx={params.idx} registerDom={params.registerChildDom}>
          <Dropable {...ftrCtx} ftrId={ftrId} idx={params.idx} registerDom={params.registerChildDom}>
            <CaptureDom
              {...ftrCtx}
              ftrId={ftrId}
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
                        children.map((child, idx) => renderNode(child, { registerChildDom, idx, registerParentMount, parentIsMount }))
                        : null
                    }
                  </Comp>
                )
              }
            </CaptureDom>
          </Dropable>
        </MouseEventCollect>
      </MemoNode>
    );
  }
}
