declare namespace ITypeRedux {
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
}
