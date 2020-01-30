import * as reducers from './reducer';
import { IMappedStateFunc, IDispatch as ITypeDispatch } from 'typeRedux';
import { IState, createInitState } from './state';

export type IDispatch = ITypeDispatch<IState, typeof reducers>;
export type IUseMappedState = <R>(mappedState: IMappedStateFunc<IState, R>) => R;

export {
  createInitState,
  reducers
};
