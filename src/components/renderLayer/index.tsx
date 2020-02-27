import * as React from 'react';
import { CaptureDom, ICaptureDomParams } from '@/components/renderLayer/captureDom';
import { Dropable } from '@/components/renderLayer/draggable';
import { MemoNode } from '@/components/renderLayer/memoNode';
import { FtrSubscribe } from '@/components/renderLayer/ftrSubscribe';
import { MouseEventCollect } from '@/components/renderLayer/mouseEventCollect';
import { DomStyle } from '@/components/renderLayer/domStyle';
import { Context } from '@/components/provider';
import { useInitial } from '@/hooks/useInitial';
import * as util from '@/lib/util';
import { RootCompId } from '@/components/root';
import { useForceUpdate } from '@/hooks/useForceUpdate';

interface IParams extends ICaptureDomParams {
  idx: number;
}

interface IProps {
  canvasId: string;
  captureDomParams: IParams;
}

export function RenderLayer(props: IProps) {
  const { globalStore } = React.useContext(Context);
  const forceUpdate = useForceUpdate();

  useInitial(() => {
    const ftrId = util.uuid();
    globalStore.setFtrId2Canvas(ftrId, props.canvasId);
    globalStore.setRoot(props.canvasId, util.buildNode({
      compId: RootCompId,
      ftrId
    }));
    globalStore.subscribeRenderLayerForceUpdate(props.canvasId, forceUpdate);
  });

  const root = globalStore.getRoot(props.canvasId);
  const rootId = root.ftrId;

  const renderNode = React.useCallback((node: IGrag.INode, params: IParams) => {
    if (node === null) {
      return null;
    }
    const { compId, children, ftrId } = node;
    const { Component, option } = globalStore.getCompInfo(compId);
    const { registerChildDom: registerDom, ...restParams } = params;
    const commonProps = {
      node, ftrId,
      rootId, option,
      isRoot: ftrId === rootId,
      registerDom,
      ...restParams
    };

    return (
      <MemoNode key={ftrId} node={node}>
        <FtrSubscribe {...commonProps}>
          <DomStyle {...commonProps}>
            <MouseEventCollect {...commonProps}>
              <Dropable {...commonProps}>
                <CaptureDom {...commonProps} >
                  {(captureParam) => (
                    <Component>
                      {
                        children.length ?
                          children.map((child, idx) => renderNode(child, { idx, ...captureParam }))
                          : null
                      }
                    </Component>
                  )}
                </CaptureDom>
              </Dropable>
            </MouseEventCollect>
          </DomStyle>
        </FtrSubscribe>
      </MemoNode>
    );
  }, [rootId]);

  return renderNode(root, props.captureDomParams);
}
