import type { Store } from 'typeRedux';
import * as reducers from './reducer';
import { IState, createInitState } from './state';

export type IDispatch = ITypeRedux.IDispatch<IState, typeof reducers>;
export type IUseMappedState = <R>(mappedState: ITypeRedux.IMappedStateFunc<IState, R>) => R;
export type ICanvasStore = Store<IState, typeof reducers>;
export type ICtx = ITypeRedux.IContext<IState, typeof reducers>;

export {
  createInitState,
  reducers
};
