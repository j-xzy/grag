import * as React from 'react';
import { GlobalStore } from '@/GlobalStore';
import { Context } from '@/components/provider';
import { IEvtEmit } from '@/EventCollect';
import { RootCompId } from '@/components/root';
import { buildNode, uuid } from '@/lib/util';
import { renderTree } from '@/lib/renderTree';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { useInitial } from '@/hooks/useInitial';
import { useListener } from '@/hooks/useListener';
import { useMount } from '@/hooks/useMount';
import { useRegisterDom } from '@/hooks/useRegisterDom';
import { useMutationObserver } from '@/hooks/useMutationObserver';

export interface IRawCanvasProps extends Omit<React.Props<any>, 'children'>, ICanvasProps {
  evtEmit: IEvtEmit;
  id: string;
  globalStore: GlobalStore;
}

interface ICanvasProps {
  style?: React.CSSProperties;
  className?: string;
  id?: string;
}

function RawCanvas(props: IRawCanvasProps) {
  const { evtEmit, style, className, id, globalStore } = props;
  const root = globalStore.getRoot(id)!;
  const domRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);

  const [registerChildDom, childDomReady] = useRegisterDom();
  const [registerMyDomMount, myDomMount] = useListener();

  const observeChildMutationRef = useMutationObserver((records) => {
    const node: any = records[0].addedNodes[0];
    childDomReady(0, node);
  }, { childList: true });

  const observeAttrMuationRef = useMutationObserver(() => {
    evtEmit('canvasStyleChange', { canvasId: id });
  }, { attributeFilter: ['style'] });

  // 监听事件
  useMount(() => {
    function handleMousemove(e: MouseEvent) {
      evtEmit('canvasMousemove', {
        coord: {
          x: e.clientX,
          y: e.clientY
        },
        canvasId: props.id
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
    // 初始时同步canvasRect
    evtEmit('canvasStyleChange', { canvasId: id });
    return () => {
      evtEmit('canvasUnMount', { canvasId: id });
    };
  });

  useMount(() => {
    myDomMount(true);
  });

  return (
    <div ref={(dom) => {
      if (dom) {
        domRef.current = dom;
        observeChildMutationRef(dom);
        observeAttrMuationRef(dom);
      }
    }}
    style={style} className={className} >
      {
        renderTree({
          root,
          globalStore,
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
  const { evtEmit, globalStore } = React.useContext(Context);

  const forceUpdate = useForceUpdate();
  const canvasId = React.useRef(id ?? uuid());

  useInitial(() => {
    const ftrId = uuid();
    globalStore.setFtrId2Canvas(ftrId, canvasId.current);
    globalStore.setRoot(canvasId.current, buildNode({
      compId: RootCompId,
      ftrId
    }));
    globalStore.subscribeForceUpdate(canvasId.current, forceUpdate);
  });

  return (
    <RawCanvas
      {...restProps}
      evtEmit={evtEmit}
      globalStore={globalStore}
      id={canvasId.current}
    />
  );
}
