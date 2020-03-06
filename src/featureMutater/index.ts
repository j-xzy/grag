import * as util from '@/lib/util';
import { GlobalStore } from '@/GlobalStore';
import { ICanvasStore } from '@/canvaStore';

interface IInsertNewFtrParam extends IGrag.IFtrStyle {
  parentFtrId: string;
  compId: string;
  ftrId: string;
}

export interface IFtrSubActMap {
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
    this.canvaStore.dispatch('updateFtrStyles', [{ ftrId, style: { x, y, width, height } }]);
    // 插入node到tree
    const canvasId = this.globalStore.getCanvasIdByFtrId(parentFtrId);
    const parent = this.globalStore.getNodeByFtrId(parentFtrId);
    if (parent) {
      const child = util.buildNode({ compId, ftrId });
      util.appendChild(parent, child);
    }
    this.globalStore.refreshFeatureLayer(canvasId);
  }

  public removeFtr(ftrId: string) {
    const canvasId = this.globalStore.getCanvasIdByFtrId(ftrId);
    const parent = this.globalStore.getParentNodeByFtrId(ftrId);
    if (parent) {
      parent.node.children.splice(parent.index, 1)[0];
    }
    this.globalStore.refreshFeatureLayer(canvasId);
  }

  public updateStyle(ftrId: string, style: IGrag.IFtrStyle) {
    const lastStyle = this.globalStore.getFtrStyle(ftrId);
    const deltX = style.x - lastStyle.x;
    const deltY = style.y - lastStyle.y;
    const styles: Array<{ ftrId: string; style: IGrag.IFtrStyle }> = [];

    // update child
    if (deltX !== 0 || deltY !== 0) {
      const childIds = this.globalStore.getAllChildren(ftrId).map((p) => p.ftrId);
      childIds.forEach((id) => {
        const ftrStyle = this.globalStore.getFtrStyle(id);
        const nextStyle = {
          x: ftrStyle.x + deltX,
          y: ftrStyle.y + deltY,
          width: id === ftrId ? style.width : ftrStyle.width,
          height: id === ftrId ? style.height : ftrStyle.height
        };
        this.notify(id, 'updateStyle', nextStyle);
        styles.push({ ftrId: id, style: nextStyle });
      });
    }

    // update currftr
    this.notify(ftrId, 'updateStyle', style);
    styles.push({ ftrId, style });
    this.canvaStore.dispatch('updateFtrStyles', styles);
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
