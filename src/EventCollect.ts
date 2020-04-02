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

  public canvasMousemove(canvasId: string, pos: IGrag.IPos) {
    const getState = this.canvaStore.getState;
    if (
      !getState().resizeType && !getState().isMoving && !getState().box && getState().isMousedown
      && getState().mouseInFtr && getState().selectedFtrs.length
    ) {
      this.canvaStore.dispatch('readyMoving');
    }

    this.canvaStore.dispatch('mousePosChange', { canvasId, pos });

    // resize、move、rotate
    if ((getState().resizeType || getState().isMoving || getState().isRotate) && getState().selectedFtrs.length) {
      this.syncSelectedFtrStyle();
    }
  }

  public canvasMouseEnter(canvasId: string) {
    this.canvaStore.dispatch('focusedCanvas', canvasId);
  }

  public canvasMouseLeave() {
    this.canvaStore.dispatch('blurCanvas');
    this.canvaStore.dispatch('clearAction');
  }

  public canvasMousedown() {
    this.canvaStore.dispatch('setMousedown');
    this.canvaStore.dispatch('clearSelectedFtrs');
  }

  public canvasMouseup() {
    this.mouseup();
  }

  public canvasMount(canvasId: string, dom: HTMLElement) {
    this.globalStore.setDom(canvasId, dom);
    this.canvasStyleChange(canvasId);
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

    const { ftrId } = this.globalStore.getRoot(canvasId);
    this.canvaStore.dispatch('updateFtrStyles', [{
      ftrId,
      style: {
        x: 0, y: 0,
        width: rect.width,
        height: rect.height
      }
    }]);
  }

  public ftrLayerMount(param: { canvasId: string; rootId: string; dom: HTMLDivElement; }) {
    this.globalStore.initRoot(param);
  }

  public ftrLayerUnmount(rootId: string) {
    this.globalStore.deleteRoot(rootId);
  }

  public ftrDropEnd(param: { compId: string; parentFtrId: string; }) {
    const { dragCompStyle } = this.canvaStore.getState();

    if (dragCompStyle) {
      const ftrId = util.uuid();
      this.ftrMutate('insertNewFtr', {
        ftrId,
        ...param,
        ...dragCompStyle
      });
      this.canvaStore.dispatch('updateMouseInFtr', ftrId);
    }
    this.canvaStore.dispatch('clearDragState');
  }

  public ftrDomDone(params: { ftrId: string; canvasId: string; dom: HTMLElement; }) {
    const { ftrId } = params;
    this.globalStore.initFtr(params);
    const style = this.canvaStore.getState().ftrStyles[ftrId];
    this.ftrMutate('updateStyle', ftrId, style);
    this.canvaStore.dispatch('updateSelectedFtrs', [ftrId]);
  }

  public ftrUnmount(ftrId: string) {
    this.globalStore.deleteFtr(ftrId);
    this.canvaStore.dispatch('deleteFtrState', ftrId);
  }

  public ftrPreviewInit(compId: string, compInfo: IGrag.ICompInfo) {
    this.globalStore.setCompInfo(compId, compInfo);
  }

  public ftrHover(ftrId: string, clientOffset: IGrag.IPos) {
    this.canvaStore.dispatch('updateHoverFtr', ftrId);
    this.canvaStore.dispatch('mousePosChange', {
      pos: clientOffset,
      canvasId: this.globalStore.getCanvasIdByFtrId(ftrId)
    });
  }

  public ftrMousedown(ftrId: string) {
    this.canvaStore.dispatch('setMousedown');
    this.canvaStore.dispatch('updateMouseInFtr', ftrId);

    const { selectedFtrs } = this.canvaStore.getState();
    if (!selectedFtrs.includes(ftrId)) {
      this.canvaStore.dispatch('updateSelectedFtrs', [ftrId]);
    }

    this.canvaStore.dispatch('deleteHighLightFtr');
  }

  public ftrMouseup() {
    this.mouseup();
  }

  public ftrMouseover(ftrId: string) {
    const { mouseInFtr, selectedFtrs, isMoving, box, resizeType } = this.canvaStore.getState();
    if (mouseInFtr === ftrId || selectedFtrs.includes(ftrId)) {
      return;
    }
    if (isMoving || box || resizeType) {
      return;
    }
    this.canvaStore.dispatch('updateMouseInFtr', ftrId);
    this.canvaStore.dispatch('sethighLightFtr', ftrId);
  }

  public ftrMouseleave() {
    this.canvaStore.dispatch('updateMouseInFtr', null);
    this.canvaStore.dispatch('deleteHighLightFtr');
  }

  public compBeginDrag(param: { compId: string; width: number; height: number; }) {
    this.canvaStore.dispatch('clearSelectedFtrs');
    this.canvaStore.dispatch('updateDragCompSize', param);
  }

  public compDragEnd() {
    this.canvaStore.dispatch('clearDragState');
  }

  public resizeMousedown(type: IGrag.IResizeType) {
    this.canvaStore.dispatch('setMousedown');
    this.canvaStore.dispatch('readyResize', type);
  }

  public resizeMouseup() {
    this.mouseup();
  }

  public rotateMousedown() {
    this.canvaStore.dispatch('setMousedown');
    this.canvaStore.dispatch('readyRotate');
  }

  public rotateMouseup() {
    this.mouseup();
  }

  private syncSelectedFtrStyle() {
    const { ftrStyles, selectedFtrs } = this.canvaStore.getState();
    selectedFtrs.forEach((id) => {
      this.ftrMutate('updateStyle', id, ftrStyles[id]);
    });
  }

  private mouseup() {
    const { isMoving, resizeType, focusedCanvas, selectedFtrs, isRotate } = this.canvaStore.getState();
    if ((isMoving || resizeType || isRotate) && focusedCanvas) {
      this.globalStore.refreshFeatureLayer(focusedCanvas);
      selectedFtrs.forEach((id) => {
        this.ftrMutate('checkChildren', id);
      });
    }
    this.canvaStore.dispatch('clearAction');
  }
}
