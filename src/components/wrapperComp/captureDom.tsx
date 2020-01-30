import * as React from 'react';
import { IRegisterDom, useRegisterDom } from '@/hooks/useRegisterDom';
import { IFtrCtx } from '@/lib/renderTree';
import { useListener } from '@/hooks/useListener';
import { useMount } from '@/hooks/useMount';

export type IRegiserParentMount = (cb: (mount: boolean) => void) => () => void;
export interface ICaptureDomParams {
  registerChildDom: IRegisterDom;
  registerParentMount: IRegiserParentMount;
  parentIsMount: boolean;
}

export interface ICaptureDomProps extends React.Props<any>, IFtrCtx {
  idx: number;
  ftrId: string;
  registerDom: IRegisterDom;
  registerParentMount: IRegiserParentMount;
  parentIsMount: boolean;
  children: (params: ICaptureDomParams) => React.ReactElement;
}

export function CaptureDom(props: ICaptureDomProps) {
  const [parentIsMount, setParentIsMount] = React.useState(props.parentIsMount);
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);
  const [registerChildDom, childDomReady] = useRegisterDom();
  const [registerMyDomMount, myDomMount] = useListener();

  const observer = React.useRef(new MutationObserver((records) => {
    records.forEach(({ addedNodes }) => {
      const ch = addedNodes[0];
      const idx = Array.prototype.indexOf.call(domRef.current?.children, ch);
      childDomReady(idx, ch);
    });
  }));

  const unSubscribeRegierDom = React.useMemo(() => {
    // 注册本节点dom挂载事件
    const unSubscribe = props.registerDom(props.idx, (dom) => {
      if (!domRef.current) {
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
