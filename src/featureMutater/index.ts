import * as util from '@/lib/util';
import { GlobalStore } from '@/GlobalStore';
import { produce } from 'produce';
import { ICanvasStore } from '@/canvaStore';

interface IActionMap {
  insertNewFtr: {
    parentFtrId: string;
    compId: string;
    ftrId: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  updateCoord: {
    ftrId: string;
    coord: IGrag.IXYCoord;
  };
}

export interface IFtrSubActMap {
  updateCoord: IGrag.IXYCoord;
}

export type IFtrMutate = FeatureMutater['mutate'];

export class FeatureMutater implements IGrag.IObj2Func<IActionMap> {
  private listeners: IGrag.IIndexable<IGrag.IIndexable<IGrag.IFunction[]>> = {};
  constructor(private globalStore: GlobalStore, private canvaStore: ICanvasStore) {
    this.mutate = this.mutate.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  public mutate<T extends keyof IActionMap>(action: T, params: IActionMap[T]) {
    (this[action] as any).call(this, params);
  }

  public insertNewFtr(param: IActionMap['insertNewFtr']) {
    const { parentFtrId, compId, ftrId } = param;

    // 更新ftrState
    const ftrState = util.calcFtrStateByStyle(param);
    this.canvaStore.dispatch('updateFtrState', { ftrId, ftrState });

    // 插入node到tree
    const canvasId = this.globalStore.getCanvasIdByFtrId(parentFtrId);
    const root = this.globalStore.getRoot(canvasId);
    const nextRoot = produce(root, (draft) => {
      const parent = util.getNodeByFtrId(draft, parentFtrId);
      if (parent) {
        const child = util.buildNode({ compId, ftrId });
        util.appendChild(parent, child);
      }
    });
    this.globalStore.setFtrId2Canvas(ftrId, canvasId);
    this.globalStore.setRoot(canvasId, nextRoot);
    this.globalStore.refreshCanvas(canvasId);
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
