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
    if (
      !getState().resizeType && !getState().isMoving && !getState().isRect && getState().isMousedown
      && getState().mouseInFtr && getState().selectedFtrs.length
    ) {
      this.canvaStore.dispatch('readyMoving');
    }

    if (
      !getState().resizeType && !getState().isMoving && !getState().isRect && getState().isMousedown
      && !getState().mouseInFtr && !getState().selectedFtrs.length
    ) {
      this.canvaStore.dispatch('readyRect');
    }

    this.canvaStore.dispatch('mouseCoordChange', { canvasId, coord });

    // move
    if (getState().isMoving && getState().selectedFtrs.length > 0) {
      this.moveFtrs();
      this.globalStore.refreshInteractionLayer(getState().focusedCanvas!);
    }

    // resize
    if (getState().resizeType) {
      this.resizeFtrs();
      this.globalStore.refreshInteractionLayer(getState().focusedCanvas!);
    }

    // rect
    if (getState().isRect) {
      this.rectSelect();
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
    this.canvaStore.dispatch('clearAction');
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
    this.canvaStore.dispatch('updateFtrStyles', [{
      ftrId: rootId,
      style: {
        x: 0, y: 0,
        width: rect.width,
        height: rect.height
      }
    }]);
  }

  public ftrDropEnd(param: { compId: string; parentFtrId: string }) {
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

  public ftrDomDone(params: { ftrId: string; canvasId: string; dom: HTMLElement }) {
    const { ftrId } = params;
    this.globalStore.initFtr(params);
    const style = this.canvaStore.getState().ftrStyles[ftrId];
    this.ftrMutate('updateStyle', ftrId, style);
    if (!this.globalStore.isRoot(ftrId)) {
      this.canvaStore.dispatch('updateSelectedFtrs', [ftrId]);
    }
  }

  public ftrUnmount(ftrId: string) {
    this.globalStore.deleteFtr(ftrId);
    this.canvaStore.dispatch('deleteFtrState', ftrId);
  }

  public ftrPreviewInit(compId: string, compInfo: IGrag.ICompInfo) {
    this.globalStore.setCompInfo(compId, compInfo);
  }

  public ftrHover(ftrId: string, clientOffset: IGrag.IXYCoord) {
    this.canvaStore.dispatch('updateHoverFtr', ftrId);
    this.canvaStore.dispatch('mouseCoordChange', {
      coord: clientOffset,
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
    this.canvaStore.dispatch('clearAction');
  }

  public ftrMouseover(ftrId: string) {
    const { mouseInFtr, selectedFtrs, isMoving, isRect } = this.canvaStore.getState();
    if (mouseInFtr === ftrId || selectedFtrs.includes(ftrId)) {
      return;
    }
    if (isMoving || isRect) {
      return;
    }
    this.canvaStore.dispatch('updateMouseInFtr', ftrId);
    this.canvaStore.dispatch('sethighLightFtr', ftrId);
  }

  public ftrMouseleave() {
    this.canvaStore.dispatch('updateMouseInFtr', null);
    this.canvaStore.dispatch('deleteHighLightFtr');
  }

  public compBeginDrag(param: { compId: string; width: number; height: number }) {
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
    this.canvaStore.dispatch('setResizeTypeNull');
  }

  private moveFtrs() {
    const state = this.canvaStore.getState();
    const deltX = state.mouseCoord.x - state.mousedownCoord.x;
    const deltY = state.mouseCoord.y - state.mousedownCoord.y;
    state.selectedFtrs.forEach((id) => {
      const { x, y, width, height } = state.beforeChangeFtrStyles[id];
      this.ftrMutate('updateStyle', id, {
        x: x + deltX,
        y: y + deltY,
        width, height
      });
    });
  }

  private resizeFtrs() {
    const state = this.canvaStore.getState();
    const deltX = state.mouseCoord.x - state.mousedownCoord.x;
    const deltY = state.mouseCoord.y - state.mousedownCoord.y;
    state.selectedFtrs.forEach((id) => {
      let { x, y, width, height } = state.beforeChangeFtrStyles[id];
      if (state.resizeType === 'e') {
        width = width + deltX;
      }
      if (state.resizeType === 's') {
        height = height + deltY;
      }
      if (state.resizeType === 'n') {
        y = y + deltY;
        height = height - deltY;
      }
      if (state.resizeType === 'w') {
        x = x + deltX;
        width = width - deltX;
      }
      if (state.resizeType === 'se') {
        height = height + deltY;
        width = width + deltX;
      }
      if (state.resizeType === 'ne') {
        y = y + deltY;
        height = height - deltY;
        width = width + deltX;
      }
      if (state.resizeType === 'nw') {
        y = y + deltY;
        height = height - deltY;
        x = x + deltX;
        width = width - deltX;
      }
      if (state.resizeType === 'sw') {
        height = height + deltY;
        x = x + deltX;
        width = width - deltX;
      }
      if (width > 1 && height > 1) {
        this.ftrMutate('updateStyle', id, { x, y, height, width });
      }
    });
  }

  private rectSelect() {
    const state = this.canvaStore.getState();
    if (!state.focusedCanvas) {
      return;
    }
    const left = Math.min(state.mouseCoord.x, state.mousedownCoord.x);
    const right = Math.max(state.mouseCoord.x, state.mousedownCoord.x);
    const top = Math.min(state.mouseCoord.y, state.mousedownCoord.y);
    const bottom = Math.max(state.mouseCoord.y, state.mousedownCoord.y);
    const selectedFtrs: string[] = [];
    const rootId = this.globalStore.getRootIdByCanvasId(state.focusedCanvas);
    const nodes = this.globalStore.getAllChildren(rootId);

    nodes.forEach((p) => {
      const { x, y, height, width } = this.globalStore.getFtrStyle(p.ftrId);
      let xIn = false;
      let yIn = false;
      if ((x >= left && x <= right) || ((x + width) >= left && (x + width) <= right)) {
        xIn = true;
      }
      if ((left >= x && left <= (x + width)) || (right >= x && right <= (x + width))) {
        xIn = true;
      }
      if ((y >= top && y <= bottom) || ((y + height) >= top && (y + height) <= bottom)) {
        yIn = true;
      }
      if ((top >= y && top <= (y + height)) || (bottom >= y && bottom <= (y + height)))  {
        yIn = true;
      }
      if (xIn && yIn) {
        selectedFtrs.push(p.ftrId);
      }
    });
    this.canvaStore.dispatch('updateSelectedFtrs', selectedFtrs);    
  }
}
