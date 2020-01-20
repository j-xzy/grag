import * as treeUitl from '@/lib/treeUtil';
import { produce } from 'produce';
import { IGetState } from './state';

interface IInsertFtrPayload {
  compId: string;
  ftrId: string;
  parentFtrId: string;
}

export function insertFtr(getState: IGetState, payload: IInsertFtrPayload) {
  console.log(payload);
  return produce(getState(), (draftState) => {
    const parent = treeUitl.getNodeByFtrId(draftState.root, payload.parentFtrId);
    parent?.children.push({
      compId: payload.compId,
      ftrId: payload.ftrId,
      children: []
    });
  });
}

export function updateEnterFtr(getState: IGetState, ftrId: string) {
  return {
    ...getState(),
    enterFtrId: ftrId
  };
}
