import type { GlobalStore } from '@/GlobalStore';
type ICreateGlobalMiddleware = (globalStore: GlobalStore) => ITypeRedux.IMiddleware;

export const createGlobalMiddleware: ICreateGlobalMiddleware = (globalStore) => (store) => {
  store.context.globalStore = globalStore;
  return (next) => (action) => {
    return next(action);
  };
};
