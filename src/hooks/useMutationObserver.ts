import * as React from 'react';

export function useMutationObserver(callback: (p: MutationRecord[]) => void, opt: MutationObserverInit) {
  const domRef: React.MutableRefObject<any> = React.useRef(null);
  const cbRef = React.useRef(callback);
  const optRef = React.useRef(opt);

  React.useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    optRef.current = opt;
  }, [opt]);

  React.useEffect(() => {
    if (!domRef.current) {
      return;
    }
    const observer = new MutationObserver(cbRef.current);
    observer.observe(domRef.current as any, optRef.current);
    return () => {
      observer.disconnect();
    };
  }, [domRef.current]);

  return domRef;
}
