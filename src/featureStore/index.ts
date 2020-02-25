import * as treeUtil from '@/lib/treeUtil';
import { ProviderStore } from '@/ProviderStore';
import { produce } from 'produce';

interface IActionMap {
  insertNewFtr: {
    parentFtrId: string;
    compId: string;
    ftrId: string;
  };
  updateCoord: {
    ftrId: string;
    coord: IGrag.IXYCoord;
  };
}

export interface IFtrSubActMap {
  updateCoord: IGrag.IXYCoord;
}

export type IFtrStoreDispatch = FeatureStore['dispatch'];

export class FeatureStore implements IGrag.IObj2Func<IActionMap> {
  private listeners: IGrag.IIndexable<IGrag.IIndexable<IGrag.IFunction[]>> = {};
  constructor(private providerStore: ProviderStore) {
    this.dispatch = this.dispatch.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  public dispatch<T extends keyof IActionMap>(action: T, params: IActionMap[T]) {
    (this[action] as any).call(this, params);
  }

  public insertNewFtr(param: IActionMap['insertNewFtr']) {
    const { parentFtrId, compId, ftrId } = param;
    const canvasId = this.providerStore.getCanvasIdByFtrId(parentFtrId);
    const root = this.providerStore.getRoot(canvasId);
    const nextRoot = produce(root, (draft) => {
      const parent = treeUtil.getNodeByFtrId(draft, parentFtrId);
      if (parent) {
        const child = treeUtil.buildNode({ compId, ftrId });
        treeUtil.appendChild(parent, child);
      }
    });
    this.providerStore.setFtrId2Canvas(ftrId, canvasId);
    this.providerStore.setRoot(canvasId, nextRoot);
    this.providerStore.refreshCanvas(canvasId);
  }

  public updateCoord(param: IActionMap['updateCoord']) {
    this.notify(param.ftrId, 'updateCoord', param.coord);
  }

  public subscribe<T extends keyof IFtrSubActMap>(id: string, action: T, callback: (payload: IFtrSubActMap[T]) => void) {
    if (!this.listeners[id]) {
      this.listeners[id] = {};
    }
    if (!this.listeners[id][action]) {
      this.listeners[id][action] = [];
    }
    this.listeners[id][action].push(callback);
  }

  public unSubscribe(id: string) {
    delete this.listeners[id];
  }

  private notify<T extends keyof IFtrSubActMap>(id: string, action: T, payload: IFtrSubActMap[T]) {
    const list = [...this.listeners[id][action]];
    list.forEach((cb) => {
      cb(payload);
    });
  }
}
