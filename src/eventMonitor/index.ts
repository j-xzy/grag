import { ICtxValue } from '@/components/provider';
import { IStore } from '@/store';
import { uuid } from '@/lib/uuid';

interface IEventMap {
  canvasMousemove: IGrag.IXYCoord;
  ftrMount: {
    ftrId: string;
  };
  ftrDrop: {
    compId: string;
    parentFtrId: string;
  };
  ftrHover: {
    targetFtrId: string;
    clientOffset: IGrag.IXYCoord;
  };
}

export type IEvtEmit = EventMonitor['emit'];

export class EventMonitor implements IGrag.IMap2Func<IEventMap>  {
  constructor(private store: IStore, private ctx: ICtxValue) {
    this.emit = this.emit.bind(this);
  }

  public emit<T extends keyof IEventMap>(evtName: T, params: IEventMap[T]) {
    (this[evtName] as any).call(this, params);
  }

  public canvasMousemove(param: IEventMap['canvasMousemove']) {
    const rootRect = this.ctx.domMap.root?.getBoundingClientRect();
    if (rootRect) {
      const coord = {
        x: param.x - rootRect.x,
        y: param.y - rootRect.y
      };
      this.store.dispatch('updateMouseCoord', coord);
    }
  }

  public ftrDrop(param: IEventMap['ftrDrop']) {
    this.store.dispatch('insertFtr', {
      ...param,
      coord: { x: 0, y: 0 },
      ftrId: uuid()
    });
  }

  public ftrMount(_param: IEventMap['ftrMount']) {
    //
  }

  public ftrHover(param: IEventMap['ftrHover']) {
    if (this.store.getState().enterFtrId !== param.targetFtrId) {
      this.store.dispatch('updateEnterFtr', param.targetFtrId);
    }
    const rootRect = this.ctx.domMap.root?.getBoundingClientRect();
    if (rootRect) {
      const coord = {
        x: param.clientOffset.x - rootRect.x,
        y: param.clientOffset.y - rootRect.y
      };
      this.store.dispatch('updateMouseCoord', coord);
    }
  }
}
