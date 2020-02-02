import * as React from 'react';
import { CaptureDom, ICaptureDomParams } from '@/components/wrapperComp/captureDom';
import { Dropable } from '@/components/wrapperComp/draggable';
import { IEvtEmit } from '@/eventMonitor';
import { MemoNode } from '@/components/wrapperComp/memoNode';
import { Monitor } from '@/components/wrapperComp/monitor';
import { MouseEventCollect } from '@/components/wrapperComp/mouseEventCollect';

interface IParams extends ICaptureDomParams {
  idx: number;
}

interface IRenderTreeProps {
  root: IGrag.INode | null;
  compMap: IGrag.ICompMap;
  evtEmit: IEvtEmit;
  captureDomParams: IParams;
}

export function renderTree(renderTreeparams: IRenderTreeProps) {
  const { compMap, root, captureDomParams, evtEmit } = renderTreeparams;
  return renderNode(root, captureDomParams);

  function renderNode(node: IGrag.INode | null, params: IParams) {
    if (node === null) {
      return null;
    }
    const { compId, children, ftrId } = node;
    const Comp = compMap[compId];
    return (
      <MemoNode key={ftrId} node={node}>
        <Monitor ftrId={ftrId} idx={params.idx} registerDom={params.registerChildDom}>
          <MouseEventCollect ftrId={ftrId} idx={params.idx} registerDom={params.registerChildDom} evtEmit={evtEmit}>
            <Dropable ftrId={ftrId} idx={params.idx} registerDom={params.registerChildDom} evtEmit={evtEmit}>
              <CaptureDom
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
        </Monitor>
      </MemoNode>
    );
  }
}
