import * as React from 'react';

type IFunc = (...params: any[]) => any;

export function useListener(lis: IFunc[] = []) {
  const listeners: React.MutableRefObject<IFunc[]> = React.useRef(lis);
  const subscribe = React.useCallback((cb: (...params: any[]) => any) => {
    listeners.current.push(cb);
    return function unSubscribe() {
      const idx = listeners.current.findIndex((listener) => listener === cb);
      if (idx >= 0) {
        listeners.current.splice(idx, 1);
      }
    };
  }, [listeners]);

  const notify = React.useCallback((...params: any[]) => {
    listeners.current.forEach((cb) => {
      cb(...params);
    });
  }, [listeners]);

  React.useEffect(() => {
    return () => {
      listeners.current = [];
    };
  }, []);

  return [subscribe, notify] as [typeof subscribe, typeof notify];
}
