import { ProviderStore } from '@/ProviderStore';
import { IFtrStoreDispatch } from '@/FeatureStore';
import { uuid } from '@/lib/uuid';

export interface IEventMap {
  canvasMousemove: IGrag.IXYCoord;
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
  ftrClick: {
    ftrId: string;
  };
}

export type IEvtEmit = EventCollect['emit'];

export class EventCollect implements IGrag.IObj2Func<IEventMap>  {
  constructor(private ftrStoreDispatch: IFtrStoreDispatch, private providerStore: ProviderStore) {
    this.emit = this.emit.bind(this);
  }

  public emit<T extends keyof IEventMap>(evtName: T, params: IEventMap[T]) {
    (this[evtName] as any).call(this, params);
  }

  public canvasMousemove(_param: IEventMap['canvasMousemove']) {
    //
  }

  public ftrDropEnd(param: IEventMap['ftrDropEnd']) {
    this.ftrStoreDispatch('insertNewFtr', { ...param, ftrId: uuid() });
  }

  public ftrDomDone(param: IEventMap['ftrDomDone']) {
    this.providerStore.setDom(param.ftrId, param.dom);
  }

  public ftrUnmount(param: IEventMap['ftrUnmount']) {
    this.providerStore.deleteDom(param.ftrId);
  }

  public ftrPreviewInit(param: IEventMap['ftrPreviewInit']) {
    const { compId, compInfo } = param;
    this.providerStore.setCompInfo(compId, compInfo);
  }

  public ftrHover(_param: IEventMap['ftrHover']) {
    //
  }

  public ftrClick(__param: IEventMap['ftrClick']) {
    //
  }
}
