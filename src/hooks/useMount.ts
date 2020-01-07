import * as React from 'react';

type EffectCallback = () => (void | (() => void | undefined));

export function useMount(mount: EffectCallback) {
  React.useLayoutEffect(mount, []);
}
