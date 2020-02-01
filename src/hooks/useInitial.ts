import * as React from 'react';

export function useInitial<T>(cb: (...params: any[]) => T) {
  return React.useMemo(cb, []);
}
