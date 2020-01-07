import { useListener } from '@/hooks/useListener';
import { useMount } from '@/hooks/useMount';
import { IDispatch, IUseMappedState } from '@/store';
import * as React from 'react';

export type IRegiserDom = (cb: (dom: HTMLElement, idx: number) => void) => () => void;
export type IRegiserParentMount = (cb: (ready: boolean) => void) => void;

export interface IProps extends React.Props<any> {
  idx: number;
  dispatch: IDispatch;
  useMappedState: IUseMappedState;
  registerDom: IRegiserDom;
  registerParentMount: IRegiserParentMount;
  children: (registerChildDom: IRegiserDom, registerParentMount: IRegiserParentMount) => React.ReactElement;
}

export function WrapperComp(props: IProps) {
  const [parentIsMount, setParentIsMount] = React.useState(false);
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);
  const [registerChildDom, childDomReady] = useListener();
  const [registerMyDomMount, myDomMount] = useListener();

  const observer = React.useRef(new MutationObserver((records) => {
    records.forEach(({ addedNodes }, idx) => {
      childDomReady(addedNodes[0], idx);
    });
  }));

  React.useLayoutEffect(() => {
    const unSubscribe = props.registerDom((dom, idx) => {
      if (!domRef.current && idx === props.idx) {
        domRef.current = dom;
        observer.current.observe(domRef.current, {
          childList: true
        });
        unSubscribe();
      }
    });
    return unSubscribe;
  }, [props.registerDom]);

  React.useLayoutEffect(() => {
    props.registerParentMount(() => {
      setParentIsMount(true);
    });
  }, [props.registerParentMount]);

  useMount(() => {
    myDomMount(true);
    return () => {
      observer.current.disconnect();
    };
  });

  return parentIsMount ? props.children(registerChildDom, registerMyDomMount) : null;
}
