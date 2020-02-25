import * as reducers from './reducer';
import { IMappedStateFunc, IDispatch as ITypeDispatch, Store } from 'typeRedux';
import { IState, createInitState } from './state';

export type IDispatch = ITypeDispatch<IState, typeof reducers>;
export type IUseMappedState = <R>(mappedState: IMappedStateFunc<IState, R>) => R;
export type ICanvasStore = Store<IState, typeof reducers>;

export {
  createInitState,
  reducers
};
