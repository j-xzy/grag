import { IGetState } from './state';

export function beforeDrop(getState: IGetState) {
  return getState();
}
