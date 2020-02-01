import * as React from 'react';

export function useListener(lis: IGrag.IFunction[] = []) {
  const listeners: React.MutableRefObject<IGrag.IFunction[]> = React.useRef(lis);
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
    const cbs = [...listeners.current];
    cbs.forEach((cb) => {
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
