import * as treeUitl from '@/lib/treeUtil';
import { IGetState } from './state';
import { produce } from 'produce';

interface IInsertFtrPayload {
  compId: string;
  ftrId: string;
  parentFtrId: string;
}

export function insertFtr(getState: IGetState, payload: IInsertFtrPayload) {
  return produce(getState(), ({ root }) => {
    const parent = treeUitl.getNodeByFtrId(root, payload.parentFtrId);
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
