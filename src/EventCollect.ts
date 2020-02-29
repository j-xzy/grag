import { GlobalStore } from '@/GlobalStore';
import { IFtrMutate } from '@/featureMutater';
import * as util from '@/lib/util';
import { ICanvasStore } from './canvaStore';

export interface IEventMap {
  canvasMousemove: {
    coord: IGrag.IXYCoord;
    canvasId: string;
  };
  canvasMouseEnter: {
    canvasId: string;
  };
  canvasMouseLeave: {
    canvasId: string;
  };
  canvasMousedown: {
    canvasId: string;
    x: number;
    y: number;
  };
  canvasMount: {
    canvasId: string;
    dom: HTMLElement;
  };
  canvasUnMount: {
    canvasId: string;
  };
  canvasStyleChange: {
    canvasId: string;
  };
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
  ftrMousedown: {
    ftrId: string;
    x: number;
    y: number;
  };
  ftrMouseup: {
    ftrId: string;
  };
  ftrMouseover: {
    ftrId: string;
  };
  ftrMouseleave: {
    ftrId: string;
  };
  compBeginDrag: {
    compId: string;
    width: number;
    height: number;
  };
  compDragEnd: {
    compId: string;
  };
  highLightLayerBlur: any;
}

export type IEvtEmit = EventCollect['emit'];

export class EventCollect implements IGrag.IObj2Func<IEventMap>  {
  constructor(
    private ftrMutate: IFtrMutate,
    private globalStore: GlobalStore,
    private canvaStore: ICanvasStore
  ) {
    this.emit = this.emit.bind(this);
  }

  public emit<T extends keyof IEventMap>(evtName: T, params: IEventMap[T]) {
    (this[evtName] as any).call(this, params);
  }

  public canvasMousemove(param: IEventMap['canvasMousemove']) {
    this.canvaStore.dispatch('mouseMove', param);
    const state = this.canvaStore.getState();
    if (state.isMoving && state.selectedFtrIds.length > 0) {
      this.moveFtrs();
    }
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
    this.canvaStore.dispatch('stopMoving');
  }

  public canvasMousedown() {
    this.canvaStore.dispatch('clearSelectedFtrs');
    this.canvaStore.dispatch('updateMousedownCoord');
  }

  public canvasMount(param: IEventMap['canvasMount']) {
    this.globalStore.setDom(param.canvasId, param.dom);
  }

  public canvasUnMount(param: IEventMap['canvasUnMount']) {
    this.globalStore.deleteDom(param.canvasId);
  }

  public canvasStyleChange(param: IEventMap['canvasStyleChange']) {
    const rect = this.globalStore.getDom(param.canvasId)?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    this.canvaStore.dispatch('updateCanvasRect', {
      id: param.canvasId,
      rect
    });

    const rootId = this.globalStore.getRootIdByCanvasId(param.canvasId);
    this.canvaStore.dispatch('updateFtrStyle', {
      ftrId: rootId,
      style: {
        x: 0, y: 0,
        width: rect.width,
        height: rect.height
      }
    });
  }

  public ftrDropEnd(param: IEventMap['ftrDropEnd']) {
    const { dragCompState } = this.canvaStore.getState();
    if (dragCompState) {
      const ftrId = util.uuid();
      this.ftrMutate('insertNewFtr', {
        ftrId,
        ...param,
        ...dragCompState
      });
    }
    this.canvaStore.dispatch('dragEnd');
  }

  public ftrDomDone(param: IEventMap['ftrDomDone']) {
    this.globalStore.setDom(param.ftrId, param.dom);
    const { x, y } = this.canvaStore.getState().ftrStateMap[param.ftrId];
    this.ftrMutate('updateCoord', {
      ftrId: param.ftrId,
      coord: { x, y }
    });
    if (!this.globalStore.isRoot(param.ftrId)) {
      this.canvaStore.dispatch('updateSelectedFtrs', [param.ftrId]);
    }
  }

  public ftrUnmount(param: IEventMap['ftrUnmount']) {
    this.globalStore.deleteDom(param.ftrId);
  }

  public ftrPreviewInit(param: IEventMap['ftrPreviewInit']) {
    const { compId, compInfo } = param;
    this.globalStore.setCompInfo(compId, compInfo);
  }

  public ftrHover(param: IEventMap['ftrHover']) {
    this.canvaStore.dispatch('updateHoverFtrId', param.ftrId);
    this.canvaStore.dispatch('mouseMove', {
      coord: param.clientOffset,
      canvasId: this.globalStore.getCanvasIdByFtrId(param.ftrId)
    });
  }

  public ftrMousedown(param: IEventMap['ftrMousedown']) {
    this.canvaStore.dispatch('updateSelectedFtrs', [param.ftrId]);
    this.canvaStore.dispatch('updateMousedownCoord');
    this.canvaStore.dispatch('beginMoving');
  }

  public ftrMouseup() {
    this.canvaStore.dispatch('stopMoving');
  }

  public ftrMouseover(param: IEventMap['ftrMouseover']) {
    this.canvaStore.dispatch('mouseEnterFtr', param.ftrId);
  }

  public ftrMouseleave() {
    this.canvaStore.dispatch('mouseLeaveFtr');
  }

  public compBeginDrag(param: IEventMap['compBeginDrag']) {
    this.canvaStore.dispatch('updateDragCompSize', param);
  }

  public compDragEnd() {
    this.canvaStore.dispatch('dragEnd');
  }

  public highLightLayerBlur() {
    this.canvaStore.dispatch('mouseLeaveFtr');
  }

  private moveFtrs() {
    const state = this.canvaStore.getState();
    const deltX = state.mouseCoordInCanvas.x - state.mousedownCoord.x;
    const deltY = state.mouseCoordInCanvas.y - state.mousedownCoord.y;
    state.selectedFtrIds.forEach((id) => {
      const { x, y } = state.beforeMoveFtrStyleMap[id];
      this.ftrMutate('updateCoord', {
        ftrId: id,
        coord: {
          x: x + deltX,
          y: y + deltY
        }
      });
    });
  }
}
