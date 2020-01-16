import { IGetState } from './state';

export function beforeDrop(getState: IGetState, component: IGrag.ICompFcClass) {
  return {
    ...getState(),
    root: {
      ...getState().root,
      children: [...getState().root.children, { component, children: [] }]
    }
  };
}
