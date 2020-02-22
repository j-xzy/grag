import { RootCompId, RootInfo } from '@/components/root';

export class CanvaStore {
  private compInfos: IGrag.ICompInfos = {
    [RootCompId]: RootInfo
  }; // compId到react组件映射
  private domMap: IGrag.IDomMap = {}; // ftrId到dom的映射
  private rootMap: IGrag.IRootMap = {}; // canvasId到root的映射

  public getCompInfo(compId: string): IGrag.IDeepReadonly<IGrag.ICompInfo> {
    return this.compInfos[compId];
  }

  public setCompInfo(compId: string, info: IGrag.ICompInfo) {
    this.compInfos[compId] = info;
  }

  public getDom(ftrId: string): HTMLElement | null {
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
}
