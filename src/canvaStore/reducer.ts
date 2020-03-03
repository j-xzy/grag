import { IGetState } from './state';

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
    state.dragCompState = {
      width, height,
      x: state.mouseCoordInCanvas.x - hoverFtrState.x - Math.floor(width / 2),
      y: state.mouseCoordInCanvas.y - hoverFtrState.y - Math.floor(height / 2),
    };
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
      x: 0, y: 0
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

export function updateFtrStyle(getState: IGetState, param: { ftrId: string; style: IGrag.IFtrStyle }) {
  let { ftrStateMap } = getState();
  ftrStateMap = {
    ...ftrStateMap,
    [param.ftrId]: param.style
  };
  return {
    ...getState(),
    ftrStateMap
  };
}

export function updateFtrCoord(getState: IGetState, param: { ftrId: string; coord: IGrag.IXYCoord }) {
  let { ftrStateMap } = getState();
  ftrStateMap = {
    ...ftrStateMap,
    [param.ftrId]: {
      ...ftrStateMap[param.ftrId],
      x: param.coord.x,
      y: param.coord.y
    }
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

export function highLightFtrs(getState: IGetState, ftrs: IGrag.IHighLightState[]) {
  return {
    ...getState(),
    highLightFtrs: ftrs
  };
}

export function mouseEnterFtr(getState: IGetState, ftrId: string) {
  if (getState().mouseInFtrId === ftrId) {
    return getState();
  }
  if (getState().selectedFtrIds.includes(ftrId)) {
    return getState();
  }
  if (getState().isMoving) {
    return getState();
  }
  const highLightFtrs = [...getState().highLightFtrs];
  const idx = highLightFtrs.findIndex((p) => p.id === getState().config.id);
  if (idx >= 0) {
    // 已存在
    highLightFtrs.splice(idx, 1);
  }
  highLightFtrs.push({
    color: getState().config.color,
    id: getState().config.id,
    ftrId
  });

  return {
    ...getState(),
    mouseInFtrId: ftrId,
    highLightFtrs
  };
}

export function mouseLeaveFtr(getState: IGetState) {
  const highLightFtrs = [...getState().highLightFtrs];
  const idx = highLightFtrs.findIndex((p) => p.id === getState().config.id);
  if (idx >= 0) {
    // 已存在
    highLightFtrs.splice(idx, 1);
  }
  return {
    ...getState(),
    mouseInFtrId: null,
    highLightFtrs
  };
}

export function stopMoving(getState: IGetState) {
  return {
    ...getState(),
    isMoving: false
  };
}

export function beginMoving(getState: IGetState) {
  const state = { ...getState() };
  const highLightFtrs = state.highLightFtrs.filter(({ ftrId }) => !state.selectedFtrIds.includes(ftrId));
  return {
    ...state,
    isMoving: true,
    highLightFtrs,
    beforeChangeFtrStyleMap: { ...state.ftrStateMap }
  };
}

export function updateMousedownCoord(getState: IGetState) {
  const { mouseCoordInCanvas } = getState();
  return {
    ...getState(),
    mousedownCoord: mouseCoordInCanvas
  };
}

export function updateIsMousedown(getState: IGetState, isMousedown: boolean) {
  return {
    ...getState(),
    isMousedown
  };
}

export function updateMouseInFtrId(getState: IGetState, mouseInFtrId: string) {
  return {
    ...getState(),
    mouseInFtrId
  };
}

export function ftrMousedown(getState: IGetState, ftrId: string) {
  const highLightFtrs = getState().highLightFtrs.filter((p) => p.ftrId !== ftrId);
  return {
    ...getState(),
    mousedownCoord: getState().mouseCoordInCanvas,
    isMousedown: true,
    mouseInFtrId: ftrId,
    selectedFtrIds: [ftrId],
    highLightFtrs
  };
}

export function canvasMousedown(getState: IGetState) {
  return {
    ...getState(),
    isMousedown: true,
    selectedFtrIds: [],
    mousedownCoord: getState().mouseCoordInCanvas
  };
}

export function resizeMousedown(getState: IGetState, resizeType: IGrag.IResizeType) {
  return {
    ...getState(),
    beforeChangeFtrStyleMap: { ...getState().ftrStateMap },
    resizeType,
    mousedownCoord: getState().mouseCoordInCanvas
  };
}

export function updateResizeType(getState: IGetState, resizeType: IGrag.IResizeType | null) {
  return {
    ...getState(),
    resizeType
  };
}

export function removeFtr(getState: IGetState, ftrId: string) {
  const state = { ...getState() };
  if (state.hoverFtrId === ftrId) {
    state.hoverFtrId = null;
  }
  state.selectedFtrIds = state.selectedFtrIds.filter((id) => id !== ftrId);
  state.highLightFtrs = state.highLightFtrs.filter((p)=> p.ftrId === ftrId);
  if(state.mouseInFtrId === ftrId){
    state.mouseInFtrId = null;
  }

  const ftrStateMap = {...state.ftrStateMap};
  delete ftrStateMap[ftrId];
  state.ftrStateMap = ftrStateMap;

  return state;
}
