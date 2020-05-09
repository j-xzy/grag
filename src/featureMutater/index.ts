import * as util from '@/lib/util';
import { GlobalStore } from '@/GlobalStore';
import { ICanvasStore } from '@/canvaStore';

interface IInsertNewFtrParam extends IGrag.IStyle {
  parentFtrId: string;
  compId: string;
  ftrId: string;
}

export interface IFtrSubActMap {
  updateStyle: IGrag.IStyle;
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
    const { parentFtrId, compId, ftrId, x, y, width, height, rotate } = param;
    // 更新ftrState
    this.canvaStore.dispatch('updateFtrStyles', [{ ftrId, style: { x, y, width, height, rotate } }]);
    // 插入node到tree
    const parent = this.globalStore.getNodeByFtrId(parentFtrId);
    if (parent) {
      const child = util.buildEmptyFtrNode({ compId, ftrId });
      util.appendChild(parent, child);
    }
  }

  public removeFtr(ftrId: string) {
    const node = this.globalStore.getNodeByFtrId(ftrId);
    if (node) {
      util.removeNode(node);
    }
  }

  /**
   * 会同时更新child、重新确认parent
   */
  public updateStyle(ftrId: string, style: IGrag.IStyle) {
    const lastStyle = this.globalStore.getFtrStyle(ftrId);
    const deltX = style.x - lastStyle.x;
    const deltY = style.y - lastStyle.y;
    const deltWidth = style.width - lastStyle.width;
    const deltHeight = style.height - lastStyle.height;
    const styles: Array<{ ftrId: string; style: IGrag.IStyle; }> = [];

    // 只是位置移动
    if (deltWidth === 0 && deltHeight === 0 && (deltX !== 0 || deltY !== 0)) {
      const childIds = this.globalStore.getDeepChildren(ftrId).map((p) => p.ftrId);
      childIds.forEach((id) => {
        const ftrStyle = this.globalStore.getFtrStyle(id);
        const nextStyle: IGrag.IStyle = {
          ...ftrStyle,
          x: ftrStyle.x + deltX,
          y: ftrStyle.y + deltY,
        };
        this.notify(id, 'updateStyle', nextStyle);
        styles.push({ ftrId: id, style: nextStyle });
      });
    }

    // update currftr
    this.notify(ftrId, 'updateStyle', style);
    styles.push({ ftrId, style });
    this.canvaStore.dispatch('updateFtrStyles', styles);

    this.checkParent(ftrId);
  }

  /**
   * 只更新style
   */
  public setStyle(ftrId: string, style: IGrag.IStyle) {
    this.notify(ftrId, 'updateStyle', style);
    this.canvaStore.dispatch('updateFtrStyles', [{ ftrId, style }]);
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

  public checkChildren(ftrId: string) {
    const ftrNode = this.globalStore.getNodeByFtrId(ftrId);
    if (!ftrNode) {
      return;
    }
    const { option: { allowChild } } = this.globalStore.getCompInfo(ftrNode.compId);
    if (!allowChild) {
      return;
    }
    const children = util.getChildren(ftrNode);
    const leaveChilds: IGrag.IFtrNode[] = [];
    children.forEach((child) => {
      if (!this.ftrInside(child.ftrId, ftrId)) {
        leaveChilds.push(child);
      }
    });

    const inChilds: IGrag.IFtrNode[] = [];
    const parent = this.globalStore.getParentNodeByFtrId(ftrId);
    if (parent) {
      const brothers = util.getChildren(parent);
      brothers.forEach((brother) => {
        if (brother.ftrId !== ftrId && this.ftrInside(brother.ftrId, ftrId)) {
          inChilds.push(brother);
        }
      });
    }

    inChilds.forEach((child) => {
      util.moveIn(child, ftrNode);
    });

    leaveChilds.forEach((child) => {
      this.checkParent(child.ftrId);
    });
  }

  private notify<T extends keyof IFtrSubActMap>(id: string, action: T, payload: IFtrSubActMap[T]) {
    const list = [...this.listeners[id][action]];
    list.forEach((cb) => {
      cb(payload);
    });
  }

  private checkParent(ftrId: string) {
    const parent = this.getPositionParent(ftrId);
    const lastParent = this.globalStore.getParentNodeByFtrId(ftrId);
    const ftrNode = this.globalStore.getNodeByFtrId(ftrId)!;
    const { option: { allowChild } } = this.globalStore.getCompInfo(parent.compId);
    if (allowChild && lastParent !== parent) {
      util.moveIn(ftrNode, parent);
    }
  }

  private getPositionParent(ftrId: string) {
    let target = this.globalStore.getParentNodeByFtrId(ftrId);
    if (!target || !this.ftrInside(ftrId, target.ftrId)) {
      target = this.globalStore.getRoot(this.globalStore.getCanvasIdByFtrId(ftrId));
    }
    while (target) {
      const children: IGrag.IFtrNode[] = util.getChildren(target);
      let inChild = false;
      for (let i = 0; i < children.length; ++i) {
        const child = children[i];
        if (child.ftrId === ftrId) {
          continue;
        }
        if (this.ftrInside(ftrId, child.ftrId)) {
          target = child;
          inChild = true;
          break;
        }
      }
      if (!inChild) {
        break;
      }
    }
    return target;
  }

  private ftrInside(sourceftrId: string, targetFtrId: string) {
    const sourceStyle = this.globalStore.getFtrStyle(sourceftrId);
    const targetStyle = this.globalStore.getFtrStyle(targetFtrId);
    return util.isInside(sourceStyle, targetStyle);
  }
}
