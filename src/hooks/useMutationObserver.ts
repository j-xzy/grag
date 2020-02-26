import * as React from 'react';

export function useMutationObserver(callback: (p: MutationRecord[]) => void, opt: MutationObserverInit) {
  const domRef: React.MutableRefObject<Node | null> = React.useRef(null);
  const cbRef = React.useRef(callback);
  const optRef = React.useRef(opt);
  const observerRef = React.useRef(new MutationObserver(cbRef.current));

  const observe = React.useCallback((dom: Node) => {
    if (dom !== domRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(dom, optRef.current);
      domRef.current = dom;
    }
  }, []);

  return observe;
}
