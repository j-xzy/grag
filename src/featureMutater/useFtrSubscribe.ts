import { FeatureMutater, IFtrSubActMap } from './index';
import { useMount } from '@/hooks/useMount';

export function createFtrSubscribe(ftrStore: FeatureMutater) {
  return function useFtrSubscribe<T extends keyof IFtrSubActMap>(id: string, action: T, callback: (payload: IFtrSubActMap[T]) => void) {
    useMount(() => {
      ftrStore.subscribe(id, action, callback);
      return () => {
        ftrStore.unSubscribe(id);
      };
    });
  };
}
