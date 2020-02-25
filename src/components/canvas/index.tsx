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
import { useMutationObserver } from '@/hooks/useMutationObserver';
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

  const observeChildMutationRef = useMutationObserver((records) => {
    const node: any = records[0].addedNodes[0];
    childDomReady(0, node);
  }, { childList: true });

  // const observeAttrMuationRef = useMutationObserver((e) => {
  //   console.log('!!!!!!', e);
  // }, { attributeFilter: ['style'] });

  // 监听事件
  useMount(() => {
    function handleMousemove(e: MouseEvent) {
      evtEmit('canvasMousemove', {
        x: e.clientX,
        y: e.clientY
      });
    }
    function handleMouseEnter() {
      evtEmit('canvasMouseEnter', { canvasId: props.id });
    }
    function handleMouseLeave() {
      evtEmit('canvasMouseLeave', { canvasId: props.id });
    }
    domRef.current?.addEventListener('mousemove', handleMousemove, true);
    domRef.current?.addEventListener('mouseenter', handleMouseEnter, true);
    domRef.current?.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      domRef.current?.removeEventListener('mousemove', handleMousemove, true);
      domRef.current?.removeEventListener('mouseenter', handleMouseEnter, true);
      domRef.current?.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  });

  // evtEmit
  useMount(() => {
    evtEmit('canvasMount', { canvasId: id, dom: domRef.current! });
    return () => {
      evtEmit('canvasUnMount', { canvasId: id });
    };
  });

  useMount(() => {
    myDomMount(true);
  });

  React.useEffect(() => {
    return () => {
      console.log('!!!1');
    };
  }, [domRef.current]);

  return (
    <div ref={(dom) => {
      if (dom) {
        domRef.current = dom;
        observeChildMutationRef.current = dom;
        // observeAttrMuationRef.current = dom;
      }
    }}
    style={style} className={className} >
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
