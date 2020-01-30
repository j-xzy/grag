import * as React from 'react';
import { useListener } from './useListener';

type IRegisterDomCb = (dom: HTMLElement) => void;
export type IRegisterDom = (idx: number, cb: IRegisterDomCb) => () => void;

export function useRegisterDom() {
  const [subscribe, notify] = useListener();
  const registerDom = React.useCallback((index: number, cb: IRegisterDomCb) => {
    return subscribe((idx: number, node: HTMLElement) => {
      if (idx === index) {
        cb(node);
      }
    });
  }, []);
  return [registerDom, notify] as [IRegisterDom, (idx: number, node: Node) => void];
}
