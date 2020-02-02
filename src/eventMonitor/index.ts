import { ICtxValue } from '@/components/provider';
import { IStore } from '@/store';
import { RootFtrId } from '@/components/root';
import { uuid } from '@/lib/uuid';

interface IEventMap {
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

  public ftrDomDone(param: IEventMap['ftrDomDone']) {
    if (param.ftrId === RootFtrId) {
      return;
    }
  }

  public ftrHover(param: IEventMap['ftrHover']) {
    if (this.store.getState().enterFtrId !== param.ftrId) {
      this.store.dispatch('updateEnterFtr', param.ftrId);
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

  public ftrClick(__param: IEventMap['ftrClick']) {
    //
  }
}
