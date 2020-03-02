import * as util from '@/lib/util';
import { GlobalStore } from '@/GlobalStore';
import { produce } from 'produce';
import { ICanvasStore } from '@/canvaStore';

interface IInsertNewFtrParam extends IGrag.IFtrStyle {
  parentFtrId: string;
  compId: string;
  ftrId: string;
}

export interface IFtrSubActMap {
  updateCoord: IGrag.IXYCoord;
  updateStyle: IGrag.IFtrStyle;
}

export type IFtrMutate = FeatureMutater['mutate'];

export class FeatureMutater {
  private listeners: IGrag.IIndexable<IGrag.IIndexable<IGrag.IFunction[]>> = {};
  constructor(private globalStore: GlobalStore, private canvaStore: ICanvasStore) {
    this.mutate = this.mutate.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  public mutate<T extends Exclude<keyof FeatureMutater, 'mutate' | 'unSubscribe' | 'subscribe'>>(action: T, ...params: Parameters<FeatureMutater[T]>) {
    (this[action] as any).apply(this, params);
  }

  public insertNewFtr(param: IInsertNewFtrParam) {
    const { parentFtrId, compId, ftrId, x, y, width, height } = param;

    // 更新ftrState
    this.canvaStore.dispatch('updateFtrStyle', { ftrId, style: { x, y, width, height } });

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
    this.globalStore.refreshRenderLayer(canvasId);
  }

  public removeFtr(ftrId: string) {
    const canvasId = this.globalStore.getCanvasIdByFtrId(ftrId);
    const root = this.globalStore.getRoot(canvasId);
    const nextRoot = produce(root, (draft) => {
      const parent = util.getParentNodeByFtrId(draft, ftrId);
      if (parent) {
        parent.node.children.splice(parent.index, 1)[0];
      }
    });
    this.globalStore.setRoot(canvasId, nextRoot);
    this.globalStore.refreshRenderLayer(canvasId);
  }

  public updateCoord(ftrId: string, coord: IGrag.IXYCoord) {
    this.canvaStore.dispatch('updateFtrCoord', { ftrId, coord });
    this.notify(ftrId, 'updateCoord', coord);
  }

  public updateStyle(ftrId: string, style: IGrag.IFtrStyle) {
    this.canvaStore.dispatch('updateFtrStyle', { ftrId, style });
    this.notify(ftrId, 'updateStyle', style);
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
