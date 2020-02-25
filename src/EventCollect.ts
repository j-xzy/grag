import { ProviderStore } from '@/ProviderStore';
import { IFtrStoreDispatch } from '@/FeatureStore';
import { uuid } from '@/lib/uuid';
import { ICanvasStore } from './canvaStore';

export interface IEventMap {
  canvasMousemove: IGrag.IXYCoord;
  canvasMouseEnter: { canvasId: string };
  canvasMouseLeave: { canvasId: string };
  canvasMount: { canvasId: string; dom: HTMLDivElement };
  canvasUnMount: { canvasId: string };
  ftrDomDone: {
    ftrId: string;
    dom: HTMLElement;
  };
  ftrUnmount: {
    ftrId: string;
  };
  ftrDropEnd: {
    compId: string;
    parentFtrId: string;
  };
  ftrPreviewInit: {
    compId: string;
    compInfo: IGrag.ICompInfo;
  };
  ftrHover: {
    ftrId: string;
    clientOffset: IGrag.IXYCoord;
  };
}

export type IEvtEmit = EventCollect['emit'];

export class EventCollect implements IGrag.IObj2Func<IEventMap>  {
  constructor(
    private ftrStoreDispatch: IFtrStoreDispatch,
    private providerStore: ProviderStore,
    private canvaStore: ICanvasStore
  ) {
    this.emit = this.emit.bind(this);
  }

  public emit<T extends keyof IEventMap>(evtName: T, params: IEventMap[T]) {
    (this[evtName] as any).call(this, params);
  }

  public canvasMousemove(param: IEventMap['canvasMousemove']) {
    this.canvaStore.dispatch('updateMouseCoord', param);
  }

  public canvasMouseEnter(param: IEventMap['canvasMouseEnter']) {
    if (param.canvasId !== this.canvaStore.getState().focusedCanvasId) {
      this.canvaStore.dispatch('updateFocusedCanvasId', param.canvasId);
    }
  }

  public canvasMouseLeave(param: IEventMap['canvasMouseLeave']) {
    if (param.canvasId === this.canvaStore.getState().focusedCanvasId) {
      this.canvaStore.dispatch('updateFocusedCanvasId', null);
    }
  }

  public canvasMount(param: IEventMap['canvasMount']) {
    this.providerStore.setDom(param.canvasId, param.dom);
    this.canvaStore.dispatch('updateCanvasRect', {
      id: param.canvasId,
      rect: param.dom.getBoundingClientRect()
    });
  }

  public canvasUnMount(param: IEventMap['canvasUnMount']) {
    this.providerStore.deleteDom(param.canvasId);
  }

  public ftrDropEnd(param: IEventMap['ftrDropEnd']) {
    this.ftrStoreDispatch('insertNewFtr', { ...param, ftrId: uuid() });
  }

  public ftrDomDone(param: IEventMap['ftrDomDone']) {
    this.providerStore.setDom(param.ftrId, param.dom);
    this.ftrStoreDispatch('updateCoord', {
      ftrId: param.ftrId,
      coord: { x: 100, y: 100 }
    });
  }

  public ftrUnmount(param: IEventMap['ftrUnmount']) {
    this.providerStore.deleteDom(param.ftrId);
  }

  public ftrPreviewInit(param: IEventMap['ftrPreviewInit']) {
    const { compId, compInfo } = param;
    this.providerStore.setCompInfo(compId, compInfo);
  }

  public ftrHover(param: IEventMap['ftrHover']) {
    this.canvaStore.dispatch('updateMouseCoord', param.clientOffset);
  }
}
