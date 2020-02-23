import * as treeUtil from '@/lib/treeUtil';
import { CanvaStore } from '@/CanvaStore';
import { produce } from 'produce';

interface IActionMap {
  insertNewFtr: {
    parentFtrId: string;
    compId: string;
    ftrId: string;
  };
}

export type IFtrStoreDispatch = FeatureStore['dispatch'];

export class FeatureStore implements IGrag.IObj2Func<IActionMap> {
  constructor(private canvaStore: CanvaStore) {
    this.dispatch = this.dispatch.bind(this);
  }

  public dispatch<T extends keyof IActionMap>(action: T, params: IActionMap[T]) {
    (this[action] as any).call(this, params);
  }

  public insertNewFtr(param: IActionMap['insertNewFtr']) {
    const { parentFtrId, compId, ftrId } = param;
    const canvasId = this.canvaStore.getCanvasIdByFtrId(parentFtrId);
    const root = this.canvaStore.getRoot(canvasId);
    const nextRoot = produce(root, (draft) => {
      const parent = treeUtil.getNodeByFtrId(draft, parentFtrId);
      if (parent) {
        const child = treeUtil.buildNode({ compId, ftrId });
        treeUtil.appendChild(parent, child);
      }
    });
    this.canvaStore.setFtrId2Canvas(ftrId, canvasId);
    this.canvaStore.setRoot(canvasId, nextRoot);
    this.canvaStore.refreshCanvas(canvasId);
  }
}
