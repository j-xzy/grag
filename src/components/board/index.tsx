import { useListener } from '@/hooks/useListener';
import { useMount } from '@/hooks/useMount';
import { renderTree } from '@/lib/renderTree';
import { IDispatch, IUseMappedState } from '@/store';
import React from 'react';

export interface IBoardProps extends Omit<React.Props<any>, 'children'> {
  style?: React.CSSProperties;
  className?: string;
  dispatch: IDispatch;
  useMappedState: IUseMappedState;
}

const tree: IGrag.INode = {
  component: (props: any) => <div>root{props.children}</div>,
  children: [{
    component: (props: any) => {
      return <div>1{props.children}</div>;
    },
    children: [
    //   {
    //   component: (props: any) => {
    //     return <span>2{props.children}</span>;
    //   },
    //   children: []
    // }
  ]
  }]
};

export function Board(props: IBoardProps) {
  const { style, className, dispatch, useMappedState } = props;
  const domRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const [registerChildDom, childDomReady] = useListener();
  const [registerMyDomMount, myDomMount] = useListener();
  const observer = React.useRef(new MutationObserver((records) => {
    const node: any = records[0].addedNodes[0];
    childDomReady(node, 0);
  }));

  useMount(() => {
    myDomMount(true);
    if (domRef.current) {
      observer.current.observe(domRef.current, {
        childList: true
      });
    }
    return observer.current.disconnect;
  });

  return (
    <div ref={domRef} style={style} className={className}>
      {
        renderTree(
          tree, { useMappedState, dispatch }, {
          registerDom: registerChildDom,
          idx: 0,
          registerParentMount: registerMyDomMount
        })
      }
    </div>
  );
}
