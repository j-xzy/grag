import { BrowserEventMonitor, IBrowserEvtEmit } from '@/eventMonitor';
import { useListener } from '@/hooks/useListener';
import { useMount } from '@/hooks/useMount';
import { renderTree } from '@/lib/renderTree';
import { IUseMappedState } from '@/store';
import * as reducers from '@/store/reducer';
import { createInitState } from '@/store/state';
import React from 'react';
import { createStore, createUseMappedState } from 'typeRedux';

export interface IRawCanvasProps extends Omit<React.Props<any>, 'children'> {
  style?: React.CSSProperties;
  className?: string;
  browserEvtEmit: IBrowserEvtEmit;
  useMappedState: IUseMappedState;
}

// const tree: IGrag.INode = {
//   component: (props: any) => <div style={{ width: '100%', height: '100%' }}>root{props.children}</div>,
//   children: [{
//     component: (props: any) => {
//       return <div style={{ width: 300, height: 300, border: '1px solid #000' }}>1{props.children}</div>;
//     },
//     children: [
//       {
//         component: (props: any) => {
//           return <div style={{ width: 200, height: 200, border: '1px solid red' }}>2{props.children}</div>;
//         },
//         children: []
//       }
//     ]
//   }, {
//     component: (props: any) => {
//       return <div style={{ width: 300, height: 300, border: '1px solid #000' }}>3{props.children}</div>;
//     },
//     children: []
//   }]
// };

function RawCanvas(props: IRawCanvasProps) {
  const tree = props.useMappedState(({ root }) => root);
  const { browserEvtEmit, style, className, useMappedState } = props;
  const domRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const [registerChildDom, childDomReady] = useListener();
  const [registerMyDomMount, myDomMount] = useListener();
  const observer = React.useRef(new MutationObserver((records) => {
    const node: any = records[0].addedNodes[0];
    childDomReady(node, 0);
  }));

  useMount(() => {
    function handleCanvasMousemmove(e: Event) {
      e.stopPropagation();
    }
    if (domRef.current) {
      observer.current.observe(domRef.current, {
        childList: true
      });
      domRef.current.addEventListener('mousemove', handleCanvasMousemmove, true);
      myDomMount(true);
    }
    return () => {
      observer.current.disconnect();
      domRef.current?.removeEventListener('mousemove', handleCanvasMousemmove, true);
    };
  });
  return (
    <div ref={domRef} style={style} className={className} >
      {
        renderTree(
          tree, { useMappedState, browserEvtEmit }, {
          registerChildDom,
          idx: 0,
          registerParentMount: registerMyDomMount,
          parentIsMount: !!domRef.current
        })
      }
    </div>
  );
}

type ICanvasProps = Omit<IRawCanvasProps, 'browserEvtEmit' | 'useMappedState'>;

export function Canvas(props: ICanvasProps) {
  const storeRef = React.useRef(createStore(createInitState(), reducers));
  const browserEvtMonitor = React.useRef(new BrowserEventMonitor(storeRef.current.dispatch));
  const useMappedStateRef = React.useRef(createUseMappedState(storeRef.current));

  return <RawCanvas browserEvtEmit={browserEvtMonitor.current.emit} useMappedState={useMappedStateRef.current} {...props} />;
}
