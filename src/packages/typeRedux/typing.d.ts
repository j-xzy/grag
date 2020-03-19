// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Store } from './createStore';

declare global {
  namespace ITypeRedux {
    interface IKeyValue<T> {
      [p: string]: T;
    }

    type IAction<S> = (ctx: IContext<S>, payload: any) => S;

    type IReducers<S> = IKeyValue<IAction<S>>;

    interface IContext<S> {
      getState: () => S;
      getLastState: () => S;
    }

    type IDispatch<S, R extends IReducers<S>> = <K extends keyof R>(action: K, payload?: Parameters<R[K]>[1]) => void;

    type IMappedStateFunc<S, R> = (state: S) => R;

    interface ITypePayload {
      type: string;
      [p: string]: any;
    }

    type IMiddleware = <S>
      (store: Store<S, ITypeRedux.IReducers<S>>)
      => (next: (mutation: ITypePayload) => S)
        => (mutation: ITypePayload) => S;
  }
}
