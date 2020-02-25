import * as React from 'react';
import { CaptureDom, ICaptureDomParams } from '@/components/wrapperComp/captureDom';
import { ProviderStore } from '@/ProviderStore';
import { Dropable } from '@/components/wrapperComp/draggable';
import { MemoNode } from '@/components/wrapperComp/memoNode';
import { Monitor } from '@/components/wrapperComp/monitor';
import { MouseEventCollect } from '@/components/wrapperComp/mouseEventCollect';

interface IParams extends ICaptureDomParams {
  idx: number;
}

interface IRenderTreeProps {
  root: IGrag.IDeepReadonly<IGrag.INode> | null;
  providerStore: ProviderStore;
  captureDomParams: IParams;
}

export function renderTree(renderTreeparams: IRenderTreeProps) {
  const { providerStore, root, captureDomParams } = renderTreeparams;
  const rootId = root?.ftrId;
  return renderNode(root, captureDomParams);

  function renderNode(node: IGrag.IDeepReadonly<IGrag.INode> | null, params: IParams) {
    if (node === null) {
      return null;
    }
    const { compId, children, ftrId } = node;
    const { Component, option } = providerStore.getCompInfo(compId);

    return (
      <MemoNode key={ftrId} node={node}>
        <Monitor isRoot={ftrId === rootId} ftrId={ftrId} idx={params.idx} registerDom={params.registerChildDom}>
          <MouseEventCollect ftrId={ftrId} idx={params.idx} registerDom={params.registerChildDom}>
            <Dropable option={option} ftrId={ftrId} idx={params.idx} registerDom={params.registerChildDom}>
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
