import * as treeUtil from '@/lib/treeUtil';
import { produce } from 'produce';
import { CanvaStore } from '@/CanvaStore';

interface IActionMap {
  insertNewFtr: {
    parentFtrId: string;
    compId: string;
    ftrId: string;
  };
}

export type IFtrStoreDispatch = FeatureStore['dispatch'];

export class FeatureStore implements IGrag.IObj2Func<IActionMap> {
  constructor(
    private canvaStore: CanvaStore,
    private ftrId2CanvasId: IGrag.IIndexable<string>,
    private refreshCanvas: (canvasId: string) => void
  ) {
    this.dispatch = this.dispatch.bind(this);
  }

  public dispatch<T extends keyof IActionMap>(action: T, params: IActionMap[T]) {
    (this[action] as any).call(this, params);
  }

  public insertNewFtr(param: IActionMap['insertNewFtr']) {
    const { parentFtrId, compId, ftrId } = param;
    const canvasId = this.ftrId2CanvasId[parentFtrId];
    const root = this.canvaStore.getRoot(canvasId);
    const nextRoot = produce(root, (draft) => {
      const parent = treeUtil.getNodeByFtrId(draft, parentFtrId);
      if (parent) {
        const child = treeUtil.buildNode({ compId, ftrId });
        treeUtil.appendChild(parent, child);
      }
    });
    this.ftrId2CanvasId[ftrId] = canvasId;
    this.canvaStore.setRoot(canvasId, nextRoot);
    this.refreshCanvas(canvasId);
  }
}
