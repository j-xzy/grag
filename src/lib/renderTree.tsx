import * as React from 'react';
import { CaptureDom, ICaptureDomParams } from '@/components/wrapperComp/captureDom';
import { CanvaStore } from '@/CanvaStore';
import { Dropable } from '@/components/wrapperComp/draggable';
import { IEvtEmit } from '@/EventCollect';
import { MemoNode } from '@/components/wrapperComp/memoNode';
import { Monitor } from '@/components/wrapperComp/monitor';
import { MouseEventCollect } from '@/components/wrapperComp/mouseEventCollect';

interface IParams extends ICaptureDomParams {
  idx: number;
}

interface IRenderTreeProps {
  root: IGrag.IDeepReadonly<IGrag.INode> | null;
  canvaStore: CanvaStore;
  evtEmit: IEvtEmit;
  captureDomParams: IParams;
}

export function renderTree(renderTreeparams: IRenderTreeProps) {
  const { canvaStore, root, captureDomParams, evtEmit } = renderTreeparams;
  return renderNode(root, captureDomParams);

  function renderNode(node: IGrag.IDeepReadonly<IGrag.INode> | null, params: IParams) {
    if (node === null) {
      return null;
    }
    const { compId, children, ftrId } = node;
    const { Component, option } = canvaStore.getCompInfo(compId);

    return (
      <MemoNode key={ftrId} node={node}>
        <Monitor ftrId={ftrId} idx={params.idx} registerDom={params.registerChildDom}>
          <MouseEventCollect ftrId={ftrId} idx={params.idx} registerDom={params.registerChildDom} evtEmit={evtEmit}>
            <Dropable option={option} ftrId={ftrId} idx={params.idx} registerDom={params.registerChildDom} evtEmit={evtEmit}>
              <CaptureDom
                ftrId={ftrId}
                idx={params.idx}
                parentIsMount={params.parentIsMount}
                registerParentMount={params.registerParentMount}
                registerDom={params.registerChildDom}
              >
                {
                  ({ registerChildDom, registerParentMount, parentIsMount }) => (
                    <Component>
                      {
                        children.length ?
                          children.map((child, idx) => renderNode(child, { registerChildDom, idx, registerParentMount, parentIsMount }))
                          : null
                      }
                    </Component>
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
