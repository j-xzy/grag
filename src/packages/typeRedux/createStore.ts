import { IEnhancer, applyMiddleware } from './applyMiddleware';
import { shallowEqual } from './shallowEqual';

export class Store<S, R extends ITypeRedux.IReducers<S>> {
  public context: ITypeRedux.IContext<S, R>;
  private state: S;
  private lastState: S;
  private actions: R;
  private listeners: Array<() => any> = [];

  constructor(preloadedState: S, reducers: R, enhancer: IEnhancer) {
    this.state = this.lastState = preloadedState;
    this.actions = reducers;

    this.dispatch = this.dispatch.bind(this);
    this.doAction = this.doAction.bind(this);
    this.getState = this.getState.bind(this);
    this.getLastState = this.getLastState.bind(this);
    this.wrapperListener = this.wrapperListener.bind(this);
    this.subscribe = this.subscribe.bind(this);

    this.context = {
      getState: this.getState,
      getLastState: this.getLastState,
      doAction: this.doAction
    } as any;

    const dispatch = enhancer(this);
    this.dispatch = dispatch.bind(this);
    this.getState = this.getState.bind(this);
    this.getLastState = this.getLastState.bind(this);
  }

  public dispatch: ITypeRedux.IDispatch<S, R> = (action, payload) => {
    if (typeof action !== 'string') {
      return this.adapterReduxDispatch(action as any);
    }

    const act = this.actions[action];
    if (!act) {
      return;
    }

    this.lastState = this.state;
    this.state = act(this.context, payload);
    this.notify();
  }

  public doAction: ITypeRedux.IDoAction<S, R> = (action, payload) => {
    const act = this.actions[action];
    if (!act) {
      return this.state;
    }
    this.state = act(this.context, payload);
    return this.state;
  }

  public subscribe(listener: (state: S) => any): () => void
  public subscribe<T>(mapState: (state: S) => T, listener: (state: T) => any): () => void
  public subscribe(mapState: any, listener?: any) {
    if (!listener) {
      listener = mapState;
    } else {
      listener = this.wrapperListener(mapState, listener);
    }
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

  private wrapperListener<T>(mapState: (state: S) => T, listener: (state: T) => any) {
    let state = mapState(this.getState());
    return () => {
      const nextState = mapState(this.getState());
      if (!shallowEqual(state, nextState)) {
        listener(nextState);
      }
      state = nextState;
    };
  }
}

export function createStore<
  S,
  R extends ITypeRedux.IReducers<S>
>(preloadedState: S, reducers: R, enhancer: IEnhancer = applyMiddleware()) {
  return new Store(preloadedState, reducers, enhancer);
}
