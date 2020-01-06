import { IGetState } from './state';

export function foo(getState: IGetState) {
  return getState();
}
