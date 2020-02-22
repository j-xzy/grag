import { IFtrStoreDispatch } from '@/FeatureStore';
import { uuid } from '@/lib/uuid';

export interface IEventMap {
  canvasMousemove: IGrag.IXYCoord;
  ftrDomDone: {
    ftrId: string;
  };
  ftrDrop: {
    compId: string;
    parentFtrId: string;
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
  constructor(private ftrStoreDispatch: IFtrStoreDispatch) {
    this.emit = this.emit.bind(this);
  }

  public emit<T extends keyof IEventMap>(evtName: T, params: IEventMap[T]) {
    (this[evtName] as any).call(this, params);
  }

  public canvasMousemove(_param: IEventMap['canvasMousemove']) {
    //
  }

  public ftrDrop(param: IEventMap['ftrDrop']) {
    this.ftrStoreDispatch('insertNewFtr', { ...param, ftrId: uuid() });
  }

  public ftrDomDone(_param: IEventMap['ftrDomDone']) {
    //
  }

  public ftrHover(_param: IEventMap['ftrHover']) {
    //
  }

  public ftrClick(__param: IEventMap['ftrClick']) {
    //
  }
}
