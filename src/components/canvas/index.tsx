import * as React from 'react';
import { ProviderStore } from '@/ProviderStore';
import { Context } from '@/components/provider';
import { IEvtEmit } from '@/EventCollect';
import { RootCompId } from '@/components/root';
import { buildNode } from '@/lib/treeUtil';
import { renderTree } from '@/lib/renderTree';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { useInitial } from '@/hooks/useInitial';
import { useListener } from '@/hooks/useListener';
import { useMount } from '@/hooks/useMount';
import { useRegisterDom } from '@/hooks/useRegisterDom';
import { uuid } from '@/lib/uuid';

export interface IRawCanvasProps extends Omit<React.Props<any>, 'children'>, ICanvasProps {
  evtEmit: IEvtEmit;
  id: string;
  providerStore: ProviderStore;
}

interface ICanvasProps {
  style?: React.CSSProperties;
  className?: string;
  id?: string;
}

function RawCanvas(props: IRawCanvasProps) {
  const { evtEmit, style, className, id, providerStore } = props;
  const root = providerStore.getRoot(id)!;
  const domRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);

  const [registerChildDom, childDomReady] = useRegisterDom();
  const [registerMyDomMount, myDomMount] = useListener();

  const observer = React.useRef(new MutationObserver((records) => {
    const node: any = records[0].addedNodes[0];
    childDomReady(0, node);
  }));

  useMount(() => {
    function handleCanvasMousemmove(e: MouseEvent) {
      e.stopPropagation();
      evtEmit('canvasMousemove', {
        x: e.clientX,
        y: e.clientY
      });
    }
    if (!domRef.current) {
      return;
    }
    providerStore.setDom(id, domRef.current);
    observer.current.observe(domRef.current, {
      childList: true
    });
    domRef.current.addEventListener('mousemove', handleCanvasMousemmove, true);
    myDomMount(true);

    return () => {
      providerStore.deleteDom(id);
      observer.current.disconnect();
      domRef.current?.removeEventListener('mousemove', handleCanvasMousemmove, true);
    };
  });

  return (
    <div ref={domRef} style={style} className={className} >
      {
        renderTree({
          root,
          providerStore, 
          captureDomParams: {
            idx: 0,
            registerParentMount: registerMyDomMount,
            parentIsMount: !!domRef.current,
            registerChildDom
          }
        })
      }
    </div>
  );
}

export function Canvas(props: ICanvasProps) {
  const { id, ...restProps } = props;
  const { evtEmit, providerStore } = React.useContext(Context);

  const forceUpdate = useForceUpdate();
  const canvasId = React.useRef(id ?? uuid());

  useInitial(() => {
    const ftrId = uuid();
    providerStore.setFtrId2Canvas(ftrId, canvasId.current);
    providerStore.setRoot(canvasId.current, buildNode({
      compId: RootCompId,
      ftrId
    }));
    providerStore.subscribeForceUpdate(canvasId.current, forceUpdate);
  });

  return (
    <RawCanvas
      {...restProps}
      evtEmit={evtEmit}
      providerStore={providerStore}
      id={canvasId.current}
    />
  );
}
