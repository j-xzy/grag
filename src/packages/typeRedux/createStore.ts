import { IEnhancer, applyMiddleware } from './applyMiddleware';

interface IKeyValue<T> {
  [p: string]: T;
}

type IAction<S> = (getState: () => S, payload: any) => S;

export type IReducers<S> = IKeyValue<IAction<S>>;

interface IContext<S, R extends IReducers<S>> {
  getState: () => S;
  getLastState: () => S;
  dispatch: IDispatch<S, R>;
}

export type IDispatch<S, R extends IReducers<S>> = <K extends keyof R>(action: K, payload?: Parameters<R[K]>[1]) => void;

export class Store<S, R extends IReducers<S>>  {
  public context: IContext<S, R>;
  private state: S;
  private lastState: S;
  private actions: R;
  private listeners: Array<() => any> = [];

  constructor(preloadedState: S, reducers: R, enhancer: IEnhancer) {
    this.state = this.lastState = preloadedState;
    this.actions = reducers;

    this.dispatch = this.dispatch.bind(this);
    this.getState = this.getState.bind(this);
    this.getLastState = this.getLastState.bind(this);

    this.context = {
      getState: this.getState,
      getLastState: this.getLastState,
      dispatch: this.dispatch
    };

    const dispatch = enhancer(this);
    this.context.dispatch = this.dispatch = dispatch.bind(this);
  }

  public dispatch: IDispatch<S, R> = (action, payload) => {
    if (typeof action !== 'string') {
      return this.adapterReduxDispatch(action as any);
    }

    const act = this.actions[action];
    if (!act) {
      return;
    }

    this.lastState = this.state;
    this.state = act(this.getState, payload);
    this.notify();
  }

  public subscribe(listener: () => any) {
    this.listeners.push(listener);
    return () => this.unSubscribe(listener);
  }

  public unSubscribe(listener: () => any) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  public getState() {
    return this.state;
  }

  public getLastState() {
    return this.lastState;
  }

  private notify() {
    this.listeners.forEach((callback) => {
      callback();
    });
  }

  private adapterReduxDispatch(action: any) {
    if (Object.prototype.toString.apply(action) === '[object Object]') {
      const { type, ...data } = action as any;
      typeof type !== 'undefined' && this.dispatch(type, data);
    }
  }
}

export function createStore<
  S,
  R extends IReducers<S>
>(preloadedState: S, reducers: R, enhancer: IEnhancer = applyMiddleware()) {
  return new Store(preloadedState, reducers, enhancer);
}
