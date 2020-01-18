import { IDispatch } from '@/store';

interface IBrowserEventMap {
  mousemove: any;
  drop: any;
}

export type IBrowserEvtEmit = BrowserEventMonitor['emit'];

export class BrowserEventMonitor implements IGrag.IMap2Func<IBrowserEventMap>  {
  constructor(private dispatch: IDispatch) {
    this.emit = this.emit.bind(this);
  }

  public emit<T extends keyof IBrowserEventMap>(evtName: T, params: IBrowserEventMap[T]) {
    this[evtName].call(this, params);
  }

  public mousemove(_a: any) {
    console.log(_a);
  }

  public drop(_a: any) {
    console.log(_a);
  }
}
