import * as React from 'react';
import * as reducers from '@/store/reducer';
import { EventMonitor, IEvtEmit } from '@/eventMonitor';
import { createStore, createUseMappedState } from 'typeRedux';
import { Context } from '@/components/provider';
import { IUseMappedState } from '@/store';
import { createInitState } from '@/store/state';
import { renderTree } from '@/lib/renderTree';
import { useListener } from '@/hooks/useListener';
import { useMount } from '@/hooks/useMount';
import { useRegisterDom } from '@/hooks/useRegisterDom';

export interface IRawCanvasProps extends Omit<React.Props<any>, 'children'>, ICanvasProps {
  evtEmit: IEvtEmit;
  useMappedState: IUseMappedState;
}

interface ICanvasProps {
  style?: React.CSSProperties;
  className?: string;
}

function RawCanvas(props: IRawCanvasProps) {
  const { evtEmit, style, className, useMappedState } = props;
  const root = useMappedState((p) => p.root);
  const domRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);

  const [registerChildDom, childDomReady] = useRegisterDom();
  const [registerMyDomMount, myDomMount] = useListener();

  const { compMap, domMap } = React.useContext(Context);

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
    domMap.canvas = domRef.current;
    observer.current.observe(domRef.current, {
      childList: true
    });
    domRef.current.addEventListener('mousemove', handleCanvasMousemmove, true);
    myDomMount(true);

    return () => {
      delete domMap.canvas;
      observer.current.disconnect();
      domRef.current?.removeEventListener('mousemove', handleCanvasMousemmove, true);
    };
  });

  return (
    <div ref={domRef} style={style} className={className} >
      {
        renderTree({
          root,
          compMap,
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
  const storeRef = React.useRef(createStore(createInitState(), reducers));
  const ctx = React.useContext(Context);
  const evtMonitor = React.useRef(new EventMonitor(storeRef.current, ctx));
  const useMappedStateRef = React.useRef(createUseMappedState(storeRef.current));

  // debug
  if (process.env.NODE_ENV === 'development') {
    (window as any).__store = storeRef.current;
  }

  return (
    <RawCanvas
      evtEmit={evtMonitor.current.emit}
      useMappedState={useMappedStateRef.current}
      {...props}
    />
  );
}
