import * as React from 'react';
import { Dropable } from '@/components/featureLayer/draggable';
import { MemoNode } from '@/components/featureLayer/memoNode';
import { FtrSubscribe } from '@/components/featureLayer/ftrSubscribe';
import { MouseEventCollect } from '@/components/featureLayer/mouseEventCollect';
import { DomDone } from '@/components/featureLayer/domDone';
import { Context } from '@/components/provider';
import { useInitial } from '@/hooks/useInitial';
import * as util from '@/lib/util';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { useMount } from '@/hooks/useMount';
import { RootCompId, rootOption } from '@/components/root';
import { useRegisterDom } from '@/hooks/useRegisterDom';
import { useMutationObserver } from '@/hooks/useMutationObserver';

interface IProps {
  canvasId: string;
}

const style: React.CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  left: 0,
  top: 0
};

const RootIdx = -1;

export function FeatureLayer(props: IProps) {
  const { globalStore } = React.useContext(Context);
  const domRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const [myMount, setMyount] = React.useState(false);
  const forceUpdate = useForceUpdate();
  const [registerChildDom, childDomReady] = useRegisterDom();

  // 监听本节点子节点的新增删除事件
  const observeChildMutationRef = useMutationObserver((records) => {
    records.forEach(({ addedNodes }) => {
      const ch = addedNodes[0];
      if (ch) {
        const idx = Array.prototype.indexOf.call(domRef.current?.children, ch);
        childDomReady(idx, ch);
      }
    });
  }, { childList: true });

  const rootId = useInitial(() => {
    const ftrId = util.uuid();
    globalStore.setFtrId2Canvas(ftrId, props.canvasId);
    globalStore.setRoot(props.canvasId, util.buildNode({
      compId: RootCompId,
      ftrId
    }));
    globalStore.subscribeRenderLayerForceUpdate(props.canvasId, forceUpdate);
    return ftrId;
  });

  useMount(() => {
    if (!domRef.current) {
      return;
    }
    globalStore.setDom(rootId, domRef.current);
    observeChildMutationRef(domRef.current);
    childDomReady(RootIdx, domRef.current);
    setMyount(true);
  });

  const nodes = globalStore.getAllChildren(rootId);

  return (
    <div ref={domRef} style={style}>
      <Dropable idx={RootIdx} ftrId={rootId} option={rootOption} registerDom={registerChildDom}>
        {
          myMount && nodes.map((node, idx) => {
            const { ftrId, compId } = node;
            const { Component, option } = globalStore.getCompInfo(compId);
            const commonProps = {
              node, ftrId,
              rootId, option,
              isRoot: ftrId === rootId,
              registerDom: registerChildDom,
              canvasId: props.canvasId,
              idx
            };

            return (
              <MemoNode key={ftrId}>
                <FtrSubscribe {...commonProps}>
                  <MouseEventCollect {...commonProps}>
                    <Dropable {...commonProps}>
                      <DomDone {...commonProps}>
                        <Component />
                      </DomDone>
                    </Dropable>
                  </MouseEventCollect>
                </FtrSubscribe>
              </MemoNode>
            );
          })
        }
      </Dropable>
    </div>
  );
}
