import * as React from 'react';
import { CanvaStore } from '@/CanvaStore';
import { Context } from '@/components/provider';
import { IEvtEmit } from '@/EventCollect';
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
  canvaStore: CanvaStore;
}

interface ICanvasProps {
  style?: React.CSSProperties;
  className?: string;
  id?: string;
}

function RawCanvas(props: IRawCanvasProps) {
  const { evtEmit, style, className, id, canvaStore } = props;
  const root = canvaStore.getRoot(id)!;
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
    canvaStore.setDom(id, domRef.current);
    observer.current.observe(domRef.current, {
      childList: true
    });
    domRef.current.addEventListener('mousemove', handleCanvasMousemmove, true);
    myDomMount(true);

    return () => {
      canvaStore.deleteDom(id);
      observer.current.disconnect();
      domRef.current?.removeEventListener('mousemove', handleCanvasMousemmove, true);
    };
  });

  return (
    <div ref={domRef} style={style} className={className} >
      {
        renderTree({
          root,
          canvaStore,
          evtEmit,
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
  const { evtEmit, canvaStore, registerCanvas } = React.useContext(Context);

  const forceUpdate = useForceUpdate();
  const canvasId = React.useRef(props.id ?? uuid());

  useInitial(() => {
    registerCanvas({
      canvasId: canvasId.current,
      forceUpdate,
    });
  });

  return (
    <RawCanvas
      {...props}
      evtEmit={evtEmit}
      canvaStore={canvaStore}
      id={canvasId.current}
    />
  );
}
