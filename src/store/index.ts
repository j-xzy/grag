import { IDispatch as ITypeDispatch, IMappedStateFunc } from 'typeRedux';
import * as reducers from './reducer';
import { createInitState, IState } from './state';

export type IDispatch = ITypeDispatch<IState, typeof reducers>;
export type IUseMappedState = <R>(mappedState: IMappedStateFunc<IState, R>) => R;

export {
  createInitState,
  reducers
};
