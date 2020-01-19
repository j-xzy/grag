import { produce } from 'produce';
import { IGetState } from './state';

interface IInsertFtrPayload {
  compId: string;
  ftrId: string;
  parentFtrId: string;
}

export function insertFtr(getState: IGetState, _payload: IInsertFtrPayload) {
  return produce(getState(), (draftState) => {
    //
  });
}

export function updateEnterFtr(getState: IGetState, ftrId: string) {
  return {
    ...getState(),
    enterFtrId: ftrId
  };
}
