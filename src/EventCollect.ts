import { GlobalStore } from '@/GlobalStore';
import { IFtrMutate } from '@/featureMutater';
import * as util from '@/lib/util';
import { ICanvasStore } from './canvaStore';

export type IEvtEmit = EventCollect['emit'];

export class EventCollect {
  constructor(
    private ftrMutate: IFtrMutate,
    private globalStore: GlobalStore,
    private canvaStore: ICanvasStore
  ) {
    this.emit = this.emit.bind(this);
  }

  public emit<T extends Exclude<keyof EventCollect, 'emit'>>(evtName: T, ...params: Parameters<EventCollect[T]>) {
    (this[evtName] as any).apply(this, params);
  }

  public canvasMousemove(canvasId: string, coord: IGrag.IXYCoord) {
    const getState = this.canvaStore.getState;
    if (!getState().isMoving && getState().isMousedown && getState().mouseInFtrId) {
      this.canvaStore.dispatch('beginMoving');
    }
    this.canvaStore.dispatch('mouseMove', { canvasId, coord });
    if (getState().isMoving && getState().selectedFtrIds.length > 0) {
      this.moveFtrs();
      this.globalStore.refreshInteractionLayer(getState().focusedCanvasId!);
    }
  }

  public canvasMouseEnter(canvasId: string) {
    if (canvasId !== this.canvaStore.getState().focusedCanvasId) {
      this.canvaStore.dispatch('updateFocusedCanvasId', canvasId);
    }
  }

  public canvasMouseLeave(canvasId: string) {
    if (canvasId === this.canvaStore.getState().focusedCanvasId) {
      this.canvaStore.dispatch('updateFocusedCanvasId', null);
    }
    this.canvaStore.dispatch('updateIsMousedown', false);
    this.canvaStore.dispatch('stopMoving');
  }

  public canvasMousedown() {
    this.canvaStore.dispatch('canvasMousedown');
  }

  public canvasMouseup() {
    this.canvaStore.dispatch('updateIsMousedown', false);
  }

  public canvasMount(canvasId: string, dom: HTMLElement) {
    this.globalStore.setDom(canvasId, dom);
  }

  public canvasUnMount(canvasId: string) {
    this.globalStore.deleteDom(canvasId);
  }

  public canvasStyleChange(canvasId: string) {
    const rect = this.globalStore.getDom(canvasId)?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    this.canvaStore.dispatch('updateCanvasRect', {
      id: canvasId,
      rect
    });

    const rootId = this.globalStore.getRootIdByCanvasId(canvasId);
    this.canvaStore.dispatch('updateFtrStyle', {
      ftrId: rootId,
      style: {
        x: 0, y: 0,
        width: rect.width,
        height: rect.height
      }
    });
  }

  public ftrDropEnd(param: { compId: string; parentFtrId: string }) {
    const { dragCompState } = this.canvaStore.getState();
    if (dragCompState) {
      const ftrId = util.uuid();
      this.ftrMutate('insertNewFtr', {
        ftrId,
        ...param,
        ...dragCompState
      });
      this.canvaStore.dispatch('updateMouseInFtrId', ftrId);
    }
    this.canvaStore.dispatch('dragEnd');
  }

  public ftrDomDone(ftrId: string, dom: HTMLElement) {
    this.globalStore.setDom(ftrId, dom);
    const { x, y } = this.canvaStore.getState().ftrStateMap[ftrId];
    this.ftrMutate('updateCoord', ftrId, { x, y });
    if (!this.globalStore.isRoot(ftrId)) {
      this.canvaStore.dispatch('updateSelectedFtrs', [ftrId]);
    }
  }

  public ftrUnmount(ftrId: string) {
    this.globalStore.deleteDom(ftrId);
  }

  public ftrPreviewInit(compId: string, compInfo: IGrag.ICompInfo) {
    this.globalStore.setCompInfo(compId, compInfo);
  }

  public ftrHover(ftrId: string, clientOffset: IGrag.IXYCoord) {
    this.canvaStore.dispatch('updateHoverFtrId', ftrId);
    this.canvaStore.dispatch('mouseMove', {
      coord: clientOffset,
      canvasId: this.globalStore.getCanvasIdByFtrId(ftrId)
    });
  }

  public ftrMousedown(ftrId: string) {
    this.canvaStore.dispatch('ftrMousedown', ftrId);
  }

  public ftrMouseup() {
    this.canvaStore.dispatch('updateIsMousedown', false);
    this.canvaStore.dispatch('stopMoving');
  }

  public ftrMouseover(param: { ftrId: string }) {
    this.canvaStore.dispatch('mouseEnterFtr', param.ftrId);
  }

  public ftrMouseleave() {
    this.canvaStore.dispatch('mouseLeaveFtr');
  }

  public compBeginDrag(param: { compId: string; width: number; height: number }) {
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
      this.ftrMutate('updateCoord', id, {
        x: x + deltX,
        y: y + deltY
      });
    });
  }
}
