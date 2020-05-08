import * as React from 'react';
import { Dropable } from '@/components/featureLayer/draggable';
import { MemoNode } from '@/components/featureLayer/memoNode';
import { FtrSubscribe } from '@/components/featureLayer/ftrSubscribe';
import { MouseEventCollect } from '@/components/featureLayer/mouseEventCollect';
import { DomDone } from '@/components/featureLayer/domDone';
import { Context } from '@/components/provider';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { useMount } from '@/hooks/useMount';
import { rootOption } from '@/components/root';
import { useRegisterDom } from '@/hooks/useRegisterDom';
import { useMutationObserver } from '@/hooks/useMutationObserver';

interface IProps {
  canvasId: string;
  rootId: string;
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
  const { canvasId, rootId } = props;
  const { globalStore, evtEmit } = React.useContext(Context);
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

  useMount(() => {
    const unSubscribeForceUpdate = globalStore.subscribeFeatureLayerForceUpdate(canvasId, forceUpdate);
    return unSubscribeForceUpdate;
  });

  useMount(() => {
    if (!domRef.current) {
      return;
    }
    evtEmit('ftrLayerMount', {
      canvasId, rootId,
      dom: domRef.current
    });
    observeChildMutationRef(domRef.current);
    childDomReady(RootIdx, domRef.current);
    setMyount(true);
    return () => {
      evtEmit('ftrLayerUnmount', rootId);
      domRef.current = null;
    };
  });

  const nodes = globalStore.getDeepChildren(rootId);
  console.debug(nodes);
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
              canvasId: canvasId,
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
