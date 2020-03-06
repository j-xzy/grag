import { RootCompId, RootInfo } from '@/components/root';
import * as util from '@/lib/util';

export class GlobalStore {
  private compInfos: IGrag.ICompInfos = {
    [RootCompId]: RootInfo
  }; // compId到react组件映射
  private domMap: IGrag.IDomMap = {}; // ftrId到dom的映射
  private ftrId2CanvasId: IGrag.IIndexable<string> = {}; // ftrId到canvasId的映射
  private canvasId2Root: IGrag.IRootMap = {}; // canvasId到root的映射
  private canvasForceUpdateMap: IGrag.IIndexable<IGrag.IFunction> = {};
  private interactionLayerForceUpdateMap: IGrag.IIndexable<IGrag.IFunction> = {};
  private renderLayerForceUpdateMap: IGrag.IIndexable<IGrag.IFunction> = {};

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
   * 设置don
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
  public initRoot(param: { canvasId: string; rootId: string; dom: HTMLDivElement }) {
    this.canvasId2Root[param.canvasId] = util.buildNode({
      ftrId: param.rootId,
      compId: RootCompId
    });
    this.domMap[param.rootId] = param.dom;
    this.ftrId2CanvasId[param.rootId] = param.canvasId;
  }

  /**
   * 删除root
   */
  public deleteRoot(rootId: string) {
    delete this.domMap[rootId];
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
   * 注册刷新canvas 
   */
  public subscribeCanvasForceUpdate(canvasId: string, forceUpdate: IGrag.IFunction) {
    this.canvasForceUpdateMap[canvasId] = forceUpdate;
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
    this.renderLayerForceUpdateMap[canvasId] = forceUpdate;
  }

  /**
   * 刷新ftrlayer
   */
  public refreshFeatureLayer(canvasId: string) {
    this.renderLayerForceUpdateMap[canvasId].call(null);
  }

  /**
   * 注册刷新InteractionLayer
   */
  public subscribeInteractionLayerForceUpdate(canvasId: string, forceUpdate: IGrag.IFunction) {
    this.interactionLayerForceUpdateMap[canvasId] = forceUpdate;
  }

  /**
   * 刷新InteractionLayer
   */
  public refreshInteractionLayer(canvasId: string) {
    this.interactionLayerForceUpdateMap[canvasId].call(null);
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
    const canvasId = this.ftrId2CanvasId[ftrId];
    const canvasRect = this.getDom(canvasId)?.getBoundingClientRect();
    const ftrRect = this.getDom(ftrId)?.getBoundingClientRect();
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
  public initFtr(params: { ftrId: string; canvasId: string; dom: HTMLElement }) {
    this.setDom(params.ftrId, params.dom);
    this.ftrId2CanvasId[params.ftrId] = params.canvasId;
  }

  /**
   * 删除ftr
   */
  public deleteFtr(ftrId: string) {
    delete this.domMap[ftrId];
    delete this.ftrId2CanvasId[ftrId];
  }

  public getNodeByFtrId(ftrId: string) {
    const root = this.canvasId2Root[this.ftrId2CanvasId[ftrId]];
    if (root) {
      return util.getNodeByFtrId(root, ftrId);
    }
  }

  public getParentNodeByFtrId(ftrId: string) {
    const root = this.canvasId2Root[this.ftrId2CanvasId[ftrId]];
    return util.getParentNodeByFtrId(root, ftrId);
  }

  public getAllChildren(ftrId: string) {
    const node = this.getNodeByFtrId(ftrId);
    if (!node) {
      return [];
    }
    return util.getAllChildren(node);
  }
}
