import { CaptureDom, ICaptureDomParams } from '@/components/wrapperComp/captureDom';
import { Dropable } from '@/components/wrapperComp/draggable';
import { Memo } from '@/components/wrapperComp/memo';
import { MouseEventCollect } from '@/components/wrapperComp/mouseEventCollect';
import { IEvtEmit } from '@/eventMonitor';
import { IUseMappedState } from '@/store';
import * as React from 'react';

export interface IFtrCtx {
  evtEmit: IEvtEmit;
  useMappedState: IUseMappedState;
}

interface IParams extends ICaptureDomParams {
  idx: number;
}

interface IRenderTreeProps {
  root: IGrag.INode | null;
  id2CompMap: IGrag.IId2CompMap;
  ftrCtx: IFtrCtx;
  captureDomParams: IParams;
}

export function renderTree(renderTreeparams: IRenderTreeProps) {
  const { id2CompMap, root, ftrCtx, captureDomParams } = renderTreeparams;
  return renderNode(root, captureDomParams);

  function renderNode(node: IGrag.INode | null, params: IParams) {
    if (node === null) {
      return null;
    }
    const { compId, children, ftrId } = node;
    const Comp = id2CompMap[compId];
    return (
      <Memo key={ftrId} x-children={children}>
        <MouseEventCollect {...ftrCtx} idx={params.idx} registerDom={params.registerChildDom}>
          <Dropable {...ftrCtx} ftrId={ftrId} idx={params.idx} registerDom={params.registerChildDom}>
            <CaptureDom
              {...ftrCtx}
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
      </Memo>
    );
  }
}
