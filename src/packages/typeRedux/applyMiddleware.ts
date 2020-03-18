import type { Store } from './createStore';

export type IEnhancer = ReturnType<typeof applyMiddleware>;

interface ITypePayload {
  type: string;
  [p: string]: any;
}

type IMiddleware = <S>
(store: Store<S, ITypeRedux.IReducers<S>>)
=> (next: (mutation: ITypePayload) => S)
  => (mutation: ITypePayload) => S;

export function applyMiddleware(...middlewares: IMiddleware[]) {
  return (store: Store<any, any>) => {
    const mutationChain = middlewares.map((middleware) => middleware(store));

    if (mutationChain.length < 1) {
      return store.dispatch;
    }

    const dispatch = store.dispatch;

    const middledispatch: ReturnType<ReturnType<IMiddleware>> = (param) => {
      const { type, payload } = param;
      dispatch(type, payload);
      return store.getState();
    };

    if (mutationChain.length === 1) {
      return (type: any, payload: any) => mutationChain[0]((action) => middledispatch(action))({ type, payload });
    } else {
      return (type: any, payload: any) => mutationChain.reduce((a, b) => (...args) => a(b(...args)))((action) => middledispatch(action))({ type, payload });
    }
  };
}
