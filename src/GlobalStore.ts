import { RootCompId, RootInfo } from '@/components/root';
import * as util from '@/lib/util';

export class GlobalStore {
  private compInfos: IGrag.ICompInfos = {
    [RootCompId]: RootInfo
  }; // compId到react组件映射
  private domMap: IGrag.IDomMap = {}; // ftrId到dom的映射
  private ftrId2CanvasId: IGrag.IIndexable<string> = {}; // ftrId到canvasId的映射
  private rootMap: IGrag.IRootMap = {}; // canvasId到root的映射
  private canvasForceUpdateMap: IGrag.IIndexable<IGrag.IFunction> = {};
  private interactionLayerForceUpdateMap: IGrag.IIndexable<IGrag.IFunction> = {};
  private renderLayerForceUpdateMap: IGrag.IIndexable<IGrag.IFunction> = {};

  public getCompInfo(compId: string): IGrag.IDeepReadonly<IGrag.ICompInfo> {
    return this.compInfos[compId];
  }

  public setCompInfo(compId: string, info: IGrag.ICompInfo) {
    this.compInfos[compId] = info;
  }

  public getDom(ftrId: string): HTMLElement {
    return this.domMap[ftrId];
  }

  public setDom(ftrId: string, dom: HTMLElement) {
    this.domMap[ftrId] = dom;
  }

  public deleteDom(ftrId: string) {
    delete this.domMap[ftrId];
  }

  public getRoot(canvasId: string): IGrag.INode {
    return this.rootMap[canvasId];
  }

  public setRoot(canvasId: string, node: IGrag.INode) {
    this.rootMap[canvasId] = node;
  }

  public subscribeCanvasForceUpdate(canvasId: string, forceUpdate: IGrag.IFunction) {
    this.canvasForceUpdateMap[canvasId] = forceUpdate;
  }

  public subscribeRenderLayerForceUpdate(canvasId: string, forceUpdate: IGrag.IFunction) {
    this.renderLayerForceUpdateMap[canvasId] = forceUpdate;
  }

  public subscribeInteractionLayerForceUpdate(canvasId: string, forceUpdate: IGrag.IFunction) {
    this.interactionLayerForceUpdateMap[canvasId] = forceUpdate;
  }

  public refreshCanvas(canvasId: string) {
    this.canvasForceUpdateMap[canvasId].call(null);
  }

  public refreshRenderLayer(canvasId: string) {
    this.renderLayerForceUpdateMap[canvasId].call(null);
  }

  public refreshInteractionLayer(canvasId: string) {
    this.interactionLayerForceUpdateMap[canvasId].call(null);
  }

  public setFtrId2Canvas(ftrId: string, canvasId: string) {
    this.ftrId2CanvasId[ftrId] = canvasId;
  }

  public getCanvasIdByFtrId(ftrId: string) {
    return this.ftrId2CanvasId[ftrId];
  }

  public getRootIdByCanvasId(canvsaId: string) {
    const node = this.rootMap[canvsaId];
    return node.ftrId;
  }

  public getRootIdByFtrId(ftrId: string) {
    return this.getRootIdByCanvasId(this.getCanvasIdByFtrId(ftrId));
  }

  public isRoot(ftrId: string) {
    return this.getRootIdByFtrId(ftrId) === ftrId;
  }

  public getFtrStyle(ftrId: string) {
    const canvasId = this.getCanvasIdByFtrId(ftrId);
    const canvasRect = this.getDom(canvasId)?.getBoundingClientRect();
    const ftrRect = this.getDom(ftrId)?.getBoundingClientRect();
    return {
      width: ftrRect.width,
      height: ftrRect.height,
      x: ftrRect.x - canvasRect.x,
      y: ftrRect.y - canvasRect.y
    };
  }

  public isFtrInCanvas(ftrId: string, canvasId: string) {
    return this.getCanvasIdByFtrId(ftrId) === canvasId;
  }

  public deleteFtr(ftrId: string) {
    this.deleteDom(ftrId);
    delete this.ftrId2CanvasId[ftrId];
  }

  public initFtr(params: { ftrId: string; canvasId: string; dom: HTMLElement }) {
    this.setDom(params.ftrId, params.dom);
    this.setFtrId2Canvas(params.ftrId, params.canvasId);
  }

  public getNodeByFtrId(ftrId: string) {
    const root = this.rootMap[this.getCanvasIdByFtrId(ftrId)];
    return util.getNodeByFtrId(root, ftrId);
  }

  public getParentNodeByFtrId(ftrId: string) {
    const root = this.rootMap[this.getCanvasIdByFtrId(ftrId)];
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
