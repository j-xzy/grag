import * as React from 'react';
import { useMount } from './useMount';

export function useIsMount() {
  const [isMount, setMount] = React.useState(false);
  useMount(() => {
    setMount(true);
    () => setMount(false);
  });
  return isMount;
}
