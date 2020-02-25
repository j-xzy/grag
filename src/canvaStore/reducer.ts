import { IGetState } from './state';

export function updateMouseCoord(getState: IGetState, coord: IGrag.IXYCoord) {
  return {
    ...getState(),
    mouseCoord: coord
  };
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
