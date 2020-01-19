import { uuid } from '@/lib/uuid';
import { IDispatch } from '@/store';

interface IEventMap {
  canvasMousemove: any;
  ftrDrop: {
    compId: string;
    parentFtrId: string;
  };
  ftrHover: {
    targetFtrId: string;
  };
}

export type IEvtEmit = EventMonitor['emit'];

export class EventMonitor implements IGrag.IMap2Func<IEventMap>  {
  constructor(private dispatch: IDispatch) {
    this.emit = this.emit.bind(this);
  }

  public emit<T extends keyof IEventMap>(evtName: T, params: IEventMap[T]) {
    this[evtName](params);
  }

  public canvasMousemove() {
    //
  }

  public ftrDrop(param: IEventMap['ftrDrop']) {
    this.dispatch('insertFtr', {
      ...param,
      ftrId: uuid()
    });
  }

  public ftrHover(param: IEventMap['ftrHover']) {
    this.dispatch('updateEnterFtr', param.targetFtrId);
  }
}
