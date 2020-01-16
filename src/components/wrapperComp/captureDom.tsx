import { useListener } from '@/hooks/useListener';
import { useMount } from '@/hooks/useMount';
import { IDispatch, IUseMappedState } from '@/store';
import * as React from 'react';

export type IRegiserDom = (cb: (dom: HTMLElement, idx: number) => void) => () => void;
export type IRegiserParentMount = (cb: (mount: boolean) => void) => () => void;
export interface IChildrenCallbackParams {
  registerChildDom: IRegiserDom;
  registerParentMount: IRegiserParentMount;
  parentIsMount: boolean;
}

export interface ICaptureDomProps extends React.Props<any> {
  idx: number;
  dispatch: IDispatch;
  useMappedState: IUseMappedState;
  registerDom: IRegiserDom;
  registerParentMount: IRegiserParentMount;
  parentIsMount: boolean;
  children: (params: IChildrenCallbackParams) => React.ReactElement;
}

export function CaptureDom(props: ICaptureDomProps) {
  const [parentIsMount, setParentIsMount] = React.useState(props.parentIsMount);
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);
  const [registerChildDom, childDomReady] = useListener();
  const [registerMyDomMount, myDomMount] = useListener();

  const observer = React.useRef(new MutationObserver((records) => {
    records.forEach(({ addedNodes }) => {
      const ch = addedNodes[0];
      const idx = Array.prototype.indexOf.call(domRef.current?.children, ch);
      childDomReady(ch, idx);
    });
  }));

  React.useLayoutEffect(() => {
    // 注册本节点dom挂载事件
    const unSubscribe = props.registerDom((dom, idx) => {
      if (!domRef.current && idx === props.idx) {
        domRef.current = dom;
        // 监听本节点子节点的新增删除事件
        observer.current.observe(domRef.current, {
          childList: true
        });
        // 解除监听
        unSubscribe();
        // 本节点dom挂载完成
        myDomMount(dom);
      }
    });
    return unSubscribe;
  }, [props.registerDom]);

  React.useLayoutEffect(() => {
    // 注册父亲节点dom挂载事件
    const unSubscribe = props.registerParentMount(() => {
      unSubscribe();
      setParentIsMount(true);
    });
    return unSubscribe;
  }, [props.registerParentMount]);

  useMount(() => {
    return () => {
      observer.current.disconnect();
    };
  });

  return parentIsMount ? props.children({
    registerChildDom,
    parentIsMount: !!domRef.current,
    registerParentMount: registerMyDomMount
  }) : null;
}
