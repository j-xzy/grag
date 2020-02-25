import * as React from 'react';

export function useResizeObserver(callback: (...p: any[]) => void) {
  const domRef: React.MutableRefObject<any> = React.useRef(null);
  const cbRef = React.useRef(callback);

  React.useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (!domRef.current) {
      return;
    }

    if (!(window as any).ResizeObserver) {
      console.error('浏览器不支持 ResizeObserver!');
      return;
    }

    const resizeObserver = new (window as any).ResizeObserver(cbRef.current);
    resizeObserver.observe(domRef.current);
    return () => {
      resizeObserver.unobserve(domRef.current);
    };
  }, [domRef.current]);

  return domRef;
}
