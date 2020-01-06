import { Board, IBoardProps } from '@/components/board';
import * as reducers from '@/store/reducer';
import { createInitState } from '@/store/state';
import * as React from 'react';
import { createStore, createUseMappedState } from 'typeRedux';

type IEnhanceBorad = Omit<IBoardProps, 'dispatch' | 'useMappedState'>;

export function createBoard() {
  const store = createStore(createInitState(), reducers);
  const dispatch = store.dispatch;
  const useMappedState = createUseMappedState(store);

  return function EnhanceBorad(props: IEnhanceBorad) {
    return React.createElement(Board, {
      ...props,
      dispatch,
      useMappedState
    });
  };
}
