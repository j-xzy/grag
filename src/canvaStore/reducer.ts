import { IGetState } from './state';
import * as util from '@/lib/util';

export function mouseMove(getState: IGetState, param: { coord: IGrag.IXYCoord; canvasId: string }) {
  const { coord, canvasId } = param;
  const state = { ...getState(), focusedCanvasId: canvasId };

  // 计算 mouseCoordInCanvas
  const canvasRect = state.canvasRectMap[canvasId];
  const mouseCoordInCanvas = {
    x: coord.x - canvasRect.x,
    y: coord.y - canvasRect.y
  };
  state.mouseCoordInCanvas = mouseCoordInCanvas;

  // 计算拖拽的compState
  if (state.dragCompState && state.hoverFtrId) {
    const hoverFtrState = state.ftrStateMap[state.hoverFtrId];
    const { width, height } = state.dragCompState;
    state.dragCompState = util.calcFtrStateByStyle({
      width, height,
      x: state.mouseCoordInCanvas.x - hoverFtrState.x - Math.floor(width / 2),
      y: state.mouseCoordInCanvas.y - hoverFtrState.y - Math.floor(height / 2),
    });
  }

  return state;
}

export function updateFocusedCanvasId(getState: IGetState, canvsId: string | null) {
  return {
    ...getState(),
    focusedCanvasId: canvsId
  };
}

export function updateCanvasRect(getState: IGetState, param: { id: string; rect: DOMRect }) {
  return {
    ...getState(),
    canvasRectMap: {
      ...getState().canvasRectMap,
      [param.id]: param.rect
    }
  };
}

export function updateDragCompSize(getState: IGetState, param: IGrag.ISize) {
  let dragCompState = getState().dragCompState;
  if (dragCompState) {
    dragCompState = { ...dragCompState, ...param };
  } else {
    dragCompState = {
      width: Math.floor(param.width),
      height: Math.floor(param.height),
      x: 0, y: 0,
      vl: 0, vm: 0, vr: 0,
      ht: 0, hm: 0, hb: 0
    };
  }
  return {
    ...getState(),
    dragCompState
  };
}

export function updateHoverFtrId(getState: IGetState, ftrId: string) {
  return {
    ...getState(),
    hoverFtrId: ftrId
  };
}

export function dragEnd(getState: IGetState) {
  return {
    ...getState(),
    dragCompState: null,
    hoverFtrId: null
  };
}

export function updateFtrState(getState: IGetState, param: { ftrId: string; ftrState: IGrag.IFtrState }) {
  let { ftrStateMap } = getState();
  ftrStateMap = {
    ...ftrStateMap,
    [param.ftrId]: param.ftrState
  };
  return {
    ...getState(),
    ftrStateMap
  };
}

export function updateSelectedFtrs(getState: IGetState, ftrIds: string[]) {
  return {
    ...getState(),
    selectedFtrIds: ftrIds
  };
}

export function clearSelectedFtrs(getState: IGetState) {
  return {
    ...getState(),
    selectedFtrIds: []
  };
}
