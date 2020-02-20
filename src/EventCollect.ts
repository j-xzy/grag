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

export class EventCollect implements IGrag.IMap2Func<IEventMap>  {
  constructor() {
    this.emit = this.emit.bind(this);
  }

  public emit<T extends keyof IEventMap>(evtName: T, params: IEventMap[T]) {
    (this[evtName] as any).call(this, params);
  }

  public canvasMousemove(_param: IEventMap['canvasMousemove']) {
    //
  }

  public ftrDrop(_param: IEventMap['ftrDrop']) {
    //
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
