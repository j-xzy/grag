import { IDispatch, IUseMappedState } from '@/store';
import * as React from 'react';

export type IDomReady = (id: number) => IDomReadyCallback;
export type IDomReadyCallback = (callback: (dom: HTMLElement) => void) => void;

export interface IProps extends React.Props<any> {
  dispatch: IDispatch;
  useMappedState: IUseMappedState;
  domReady: IDomReadyCallback;
  idx: number;
  children: (domReady: IDomReady) => React.ReactElement;
}

export function WrapperComp(props: IProps) {
  const [flag, setFlag] = React.useState(false);
  const domRef: React.MutableRefObject<HTMLElement | null> = React.useRef(null);

  React.useEffect(() => {
    console.log('child')
    setFlag(true);
  }, []);

  React.useEffect(() => {
    props.domReady((dom) => {
      domRef.current = dom;
    });
    return () => { domRef.current = null; };
  }, [props.domReady, domRef]); // deps 不会change

  const domReady = React.useCallback((_id: number) => {
    return (cb: (dom: HTMLElement) => void) => {
      const observer = new MutationObserver((records) => {
        cb(records[0].addedNodes[0] as HTMLElement);
      });

      if (domRef.current) {
        observer.observe(domRef.current);
      }
    };
  }, []);

  return flag ? props.children(domReady) : null;
}
