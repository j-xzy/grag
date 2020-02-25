import { FeatureStore, IFtrSubActMap } from './index';
import { useMount } from '@/hooks/useMount';
import { useInitial } from '@/hooks/useInitial';

export function createFtrSubscribe(ftrStore: FeatureStore) {
  return function useFtrSubscribe<T extends keyof IFtrSubActMap>(id: string, action: T, callback: (payload: IFtrSubActMap[T]) => void) {
    useInitial(() => {
      ftrStore.subscribe(id, action, callback);
    });
    useMount(() => {
      return () => {
        ftrStore.unSubscribe(id);
      };
    });
  };
}
