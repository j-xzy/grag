import * as treeUitl from '@/lib/treeUtil';
import { IGetState } from './state';
import { produce } from 'produce';

interface IInsertFtrPayload {
  compId: string;
  ftrId: string;
  parentFtrId: string;
  coord: IGrag.IXYCoord;
}

export function insertFtr(getState: IGetState, payload: IInsertFtrPayload) {
  return produce(getState(), ({ root }) => {
    const parent = treeUitl.getNodeByFtrId(root, payload.parentFtrId);
    parent?.children.push({
      compId: payload.compId,
      ftrId: payload.ftrId,
      coord: payload.coord,
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

export function updateMouseCoord(getState: IGetState, coord: IGrag.IXYCoord) {
  return {
    ...getState(),
    mouseCoord: coord
  };
}
