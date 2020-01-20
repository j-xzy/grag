import { useListener } from '@/hooks/useListener';
import { useMount } from '@/hooks/useMount';
import { IFtrCtx } from '@/lib/renderTree';
import * as React from 'react';

export type IRegiserDom = (cb: (dom: HTMLElement, idx: number) => void) => () => void;
export type IRegiserParentMount = (cb: (mount: boolean) => void) => () => void;
export interface ICaptureDomParams {
  registerChildDom: IRegiserDom;
  registerParentMount: IRegiserParentMount;
  parentIsMount: boolean;
}

export interface ICaptureDomProps extends React.Props<any>, IFtrCtx {
  idx: number;
  ftrId: string;
  registerDom: IRegiserDom;
  registerParentMount: IRegiserParentMount;
  parentIsMount: boolean;
  children: (params: ICaptureDomParams) => React.ReactElement;
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

  const unSubscribeRegierDom = React.useMemo(() => {
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

  const unSubscribeParentMount = React.useMemo(() => {
    // 注册父亲节点dom挂载事件
    const unSubscribe = props.registerParentMount(() => {
      unSubscribe();
      setParentIsMount(true);
    });
    return unSubscribe;
  }, []);

  useMount(() => {
    return () => {
      unSubscribeRegierDom();
      unSubscribeParentMount();
      observer.current.disconnect();
    };
  });

  return parentIsMount ? props.children({
    registerChildDom,
    parentIsMount: !!domRef.current,
    registerParentMount: registerMyDomMount
  }) : null;
}
