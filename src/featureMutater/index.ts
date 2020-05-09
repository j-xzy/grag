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

  /**
   * 插入新feature
   */
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

  /**
   * 移除feature
   */
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

  /**
   * 注册action
   */
  public subscribe<T extends keyof IFtrSubActMap>(id: string, action: T, callback: (payload: IFtrSubActMap[T]) => void) {
    if (!this.listeners[id]) {
      this.listeners[id] = {};
    }
    if (!this.listeners[id][action]) {
      this.listeners[id][action] = [];
    }
    this.listeners[id][action].push(callback);
  }

  /**
   * 接触对应id的所有action监听
   */
  public unSubscribe(id: string) {
    delete this.listeners[id];
  }

  /**
   * 检查孩子节点
   */
  public checkChildren(ftrId: string) {
    const ftrNode = this.globalStore.getNodeByFtrId(ftrId);
    if (!ftrNode) {
      return;
    }
    const { option: { allowChild } } = this.globalStore.getCompInfo(ftrNode.compId);
    if (!allowChild) {
      return;
    }

    const leaveChilds: IGrag.IFtrNode[] = [];
    util.traverse(ftrNode)((child) => {
      if (child.ftrId !== ftrNode.ftrId && !this.ftrInside(child.ftrId, ftrId)) {
        leaveChilds.push(child);
      }
    });

    const inChilds: IGrag.IFtrNode[] = [];
    const parent = this.globalStore.getParentNodeByFtrId(ftrId);
    if (parent) {
      util.traverse(parent)((brother) => {
        if (
          brother.ftrId !== parent.ftrId
          && brother.ftrId !== ftrId
          && this.ftrInside(brother.ftrId, ftrId)
        ) {
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

  /**
   * 检查父亲节点
   */
  private checkParent(ftrId: string) {
    const parent = this.getPositionParent(ftrId);
    const lastParent = this.globalStore.getParentNodeByFtrId(ftrId);
    const ftrNode = this.globalStore.getNodeByFtrId(ftrId)!;
    const { option: { allowChild } } = this.globalStore.getCompInfo(parent.compId);
    if (allowChild && lastParent !== parent) {
      util.moveIn(ftrNode, parent);
    }
  }

  /**
   * 触发对应action的监听
   */
  private notify<T extends keyof IFtrSubActMap>(id: string, action: T, payload: IFtrSubActMap[T]) {
    const list = [...this.listeners[id][action]];
    list.forEach((cb) => {
      cb(payload);
    });
  }

  /**
   * 得到位置上的父亲节点
   */
  private getPositionParent(ftrId: string) {
    let target = this.globalStore.getParentNodeByFtrId(ftrId);
    if (!target || !this.ftrInside(ftrId, target.ftrId)) {
      target = this.globalStore.getRoot(this.globalStore.getCanvasIdByFtrId(ftrId));
    }
    while (target) {
      let inChild = false;
      util.traverse(target)((child) => {
        if (inChild) {
          return;
        }
        if (child.ftrId === target?.ftrId || child.ftrId === ftrId) {
          return;
        }
        if (this.ftrInside(ftrId, child.ftrId)) {
          target = child;
          inChild = true;
        }
      });
      if (!inChild) {
        break;
      }
    }
    return target;
  }

  /**
   * source是否在target内
   */
  private ftrInside(sourceftrId: string, targetFtrId: string) {
    const sourceStyle = this.globalStore.getFtrStyle(sourceftrId);
    const targetStyle = this.globalStore.getFtrStyle(targetFtrId);
    return util.isInside(sourceStyle, targetStyle);
  }
}
