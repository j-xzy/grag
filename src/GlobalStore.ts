import { RootCompId, RootInfo } from '@/components/root';
import * as util from '@/lib/util';

export class GlobalStore {
  private compInfos: IGrag.ICompInfos = {
    [RootCompId]: RootInfo
  }; // compId到react组件映射
  private domMap: IGrag.IDoms = {}; // ftrId到dom的映射
  private ftrId2CanvasId: IGrag.IIndexable<string> = {}; // ftrId到canvasId的映射
  private ftrId2Node: IGrag.IIndexable<IGrag.IFtrNode> = {}; // ftrId到node的映射
  private canvasId2Root: IGrag.IRoots = {}; // canvasId到root的映射
  private canvasForceUpdateMap: IGrag.IIndexable<IGrag.IFunction> = {}; // 强刷<Canvas />
  private actionLayerForceUpdateMap: IGrag.IIndexable<IGrag.IFunction> = {};  // 强刷<ActionLayer />
  private featureLayerForceUpdateMap: IGrag.IIndexable<IGrag.IFunction> = {}; // 强刷<FeatureLayer />

  /**
   * 设置roots相关信息
   */
  public setRoots(roots: IGrag.IIndexable<IGrag.IStraightFtrNode>) {
    for (const canvasId in roots) {
      const root = roots[canvasId];
      const ftrNode = util.unStraightNode(root, null);
      this.canvasId2Root[canvasId] = ftrNode;
      util.traverse(ftrNode)((node) => {
        this.ftrId2CanvasId[node.ftrId] = canvasId;
        this.ftrId2Node[node.ftrId] = node;
      });
    }
  }

  /**
   * 得到组件的相关信息
   * @param compId 组件id
   */
  public getCompInfo(compId: string): IGrag.IDeepReadonly<IGrag.ICompInfo> {
    return this.compInfos[compId];
  }

  /**
   * 设置组件的相关信息
   */
  public setCompInfo(compId: string, info: IGrag.ICompInfo) {
    this.compInfos[compId] = info;
  }

  /**
   * 得到dom
   */
  public getDom(id: string): HTMLElement {
    return this.domMap[id];
  }

  /**
   * 设置dom
   */
  public setDom(id: string, dom: HTMLElement) {
    this.domMap[id] = dom;
  }

  /**
   * 删除dom
   */
  public deleteDom(id: string) {
    delete this.domMap[id];
  }

  /**
   * 初始root(ftrLayer)
   */
  public initRoot(param: { canvasId: string; rootId: string; dom: HTMLDivElement; }) {
    if (!this.canvasId2Root[param.canvasId]) {
      const node = util.buildEmptyFtrNode({
        ftrId: param.rootId,
        compId: RootCompId
      });
      this.canvasId2Root[param.canvasId] = node;
      this.ftrId2Node[param.rootId] = node;
    }
    this.domMap[param.rootId] = param.dom;
    this.ftrId2CanvasId[param.rootId] = param.canvasId;
  }

  /**
   * 删除root
   */
  public deleteRoot(rootId: string) {
    delete this.domMap[rootId];
    delete this.ftrId2Node[rootId];
    const canvasId = this.ftrId2CanvasId[rootId];
    if (canvasId) {
      delete this.canvasId2Root[canvasId];
    }
    delete this.ftrId2CanvasId[rootId];
  }

  /**
   * 根据canvasID得到Root
   */
  public getRoot(canvasId: string) {
    return this.canvasId2Root[canvasId];
  }

  /**
   * 得到Roots
   */
  public getRoots() {
    return this.canvasId2Root;
  }

  /**
   * 注册刷新canvas 
   */
  public subscribeCanvasForceUpdate(canvasId: string, forceUpdate: IGrag.IFunction) {
    this.canvasForceUpdateMap[canvasId] = forceUpdate;
    return () => {
      delete this.canvasForceUpdateMap[canvasId];
    };
  }

  /**
   * 刷新canvas
   */
  public refreshCanvas(canvasId: string) {
    this.canvasForceUpdateMap[canvasId].call(null);
  }

  /**
   * 注册刷新ftrlayer
   */
  public subscribeFeatureLayerForceUpdate(canvasId: string, forceUpdate: IGrag.IFunction) {
    this.featureLayerForceUpdateMap[canvasId] = forceUpdate;
    return () => {
      delete this.featureLayerForceUpdateMap[canvasId];
    };
  }

  /**
   * 刷新ftrlayer
   */
  public refreshFeatureLayer(canvasId: string) {
    this.featureLayerForceUpdateMap[canvasId].call(null);
  }

  /**
   * 注册刷新ActionLayer
   */
  public subscribeActionLayerForceUpdate(canvasId: string, forceUpdate: IGrag.IFunction) {
    this.actionLayerForceUpdateMap[canvasId] = forceUpdate;
    return () => {
      delete this.actionLayerForceUpdateMap[canvasId];
    };
  }

  /**
   * 刷新ActionLayer
   */
  public refreshActionLayer(canvasId: string) {
    this.actionLayerForceUpdateMap[canvasId].call(null);
  }

  /**
   * 根据ftrId得到对应的canvasId
   */
  public getCanvasIdByFtrId(ftrId: string) {
    return this.ftrId2CanvasId[ftrId];
  }

  /**
   * 根据ftrid得到style
   */
  public getFtrStyle(ftrId: string) {
    const dom = this.getDom(ftrId);
    const { width, height, left, top } = window.getComputedStyle(dom);
    return {
      width: parseInt(width),
      height: parseInt(height),
      x: parseInt(left),
      y: parseInt(top),
      rotate: util.parseRotate(dom.style.transform)
    };
  }

  /**
   * 根据ftrid得到boundingRect
   */
  public getFtrBoundRect(ftrId: string) {
    const canvasId = this.ftrId2CanvasId[ftrId];
    const canvasRect = this.getDom(canvasId).getBoundingClientRect();
    const ftrRect = this.getDom(ftrId).getBoundingClientRect();
    return {
      width: ftrRect.width,
      height: ftrRect.height,
      x: ftrRect.x - canvasRect.x,
      y: ftrRect.y - canvasRect.y
    };
  }

  /**
   * ftr是否在对应的canvas中 
   */
  public isFtrInCanvas(ftrId: string, canvasId: string) {
    return this.ftrId2CanvasId[ftrId] === canvasId;
  }

  /**
   * 初始ftr
   */
  public initFtr(params: { ftrId: string; canvasId: string; dom: HTMLElement; }) {
    this.setDom(params.ftrId, params.dom);
    this.ftrId2CanvasId[params.ftrId] = params.canvasId;
    if (!this.ftrId2Node[params.ftrId]) {
      const node = util.getNodeByFtrId(this.getRoot(params.canvasId), params.ftrId);
      node && (this.ftrId2Node[params.ftrId] = node);
    }
  }

  /**
   * 删除ftr
   */
  public deleteFtr(ftrId: string) {
    delete this.domMap[ftrId];
    delete this.ftrId2CanvasId[ftrId];
    delete this.ftrId2Node[ftrId];
  }

  /**
   * 得到node
   */
  public getNodeByFtrId(ftrId: string) {
    let node: IGrag.IFtrNode | null = this.ftrId2Node[ftrId];
    if (node) {
      return node;
    }
    const root = this.canvasId2Root[this.ftrId2CanvasId[ftrId]];
    if (root) {
      node = util.getNodeByFtrId(root, ftrId);
      node && (this.ftrId2Node[ftrId] = node);
      return node;
    }
    return null;
  }

  /**
   * 得到parentnode
   */
  public getParentNodeByFtrId(ftrId: string) {
    const node = this.getNodeByFtrId(ftrId);
    if (node) {
      return util.getParentNode(node);
    }
  }

  /**
   * 得到所有的孩子节点（deep）
   */
  public getDeepChildren(ftrId: string) {
    const node = this.getNodeByFtrId(ftrId);
    if (!node) {
      return [];
    }
    return util.getDeepChildren(node);
  }

  /**
   * 得到无循环的roots
   */
  public getStraightRoots() {
    const roots: IGrag.IIndexable<IGrag.IStraightFtrNode> = {};
    for (const cnavasId in this.canvasId2Root) {
      const root = this.canvasId2Root[cnavasId];
      roots[cnavasId] = util.straightNode(root);
    }
    return roots;
  }
}
