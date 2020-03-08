import { IGetState, IState } from './state';

// 更新state
export function updateState(getState: IGetState, state: Partial<IState>) {
  return {
    ...getState(),
    ...state
  };
}

// 批量更新ftrStyle
export function updateFtrStyles(getState: IGetState, param: { ftrId: string; style: IGrag.IFtrStyle; }[]) {
  const ftrStyles = { ...getState().ftrStyles };
  param.forEach((p) => {
    ftrStyles[p.ftrId] = p.style;
  });
  return {
    ...getState(),
    ftrStyles
  };
}

// 准备移动
export function readyMoving(getState: IGetState) {
  const state = { ...getState() };
  return {
    ...state,
    isMoving: true,
    isRect: false,
    beforeChangeFtrStyles: { ...state.ftrStyles }
  };
}

// 准备框选
export function readyRect(getState: IGetState) {
  const state = { ...getState() };
  return {
    ...state,
    isMoving: false,
    isRect: true,
  };
}

// 鼠标坐标改变
export function mouseCoordChange(getState: IGetState, param: { coord: IGrag.IXYCoord; canvasId: string; }) {
  const { coord, canvasId } = param;
  const state = { ...getState(), focusedCanvas: canvasId };

  // 计算 mouseCoord
  const canvasRect = state.canvasRects[canvasId];
  const mouseCoord = {
    x: coord.x - canvasRect.x,
    y: coord.y - canvasRect.y
  };
  state.mouseCoord = mouseCoord;

  // 计算拖拽的compState
  if (state.dragCompStyle && state.hoverFtr) {
    const { width, height } = state.dragCompStyle;
    state.dragCompStyle = {
      width, height,
      x: state.mouseCoord.x - Math.floor(width / 2),
      y: state.mouseCoord.y - Math.floor(height / 2),
    };
  }

  return state;
}

// 聚焦canvas
export function focusedCanvas(getState: IGetState, canvsId: string) {
  return {
    ...getState(),
    focusedCanvas: canvsId
  };
}

// 失焦canvas
export function blurCanvas(getState: IGetState) {
  return {
    ...getState(),
    focusedCanvas: null
  };
}

// 清除当前动作（移动ftr、拉框选择、resizeftr...）
export function clearAction(getState: IGetState) {
  return {
    ...getState(),
    isMoving: false,
    isRect: false,
    isMousedown: false,
    resizeType: null
  };
}

// 置为鼠标down
export function setMousedown(getState: IGetState) {
  return {
    ...getState(),
    isMousedown: true,
    mousedownCoord: getState().mouseCoord
  };
}

// 清除选中的ftr
export function clearSelectedFtrs(getState: IGetState) {
  return {
    ...getState(),
    selectedFtrs: []
  };
}

// 更新canvas的rect
export function updateCanvasRect(getState: IGetState, param: { id: string; rect: DOMRect; }) {
  return {
    ...getState(),
    canvasRects: {
      ...getState().canvasRects,
      [param.id]: param.rect
    }
  };
}

// 清除drag的状态
export function clearDragState(getState: IGetState) {
  return {
    ...getState(),
    dragCompStyle: null,
    hoverFtr: null
  };
}

// 更新mouseInFtr
export function updateMouseInFtr(getState: IGetState, mouseInFtr: string | null) {
  return {
    ...getState(),
    mouseInFtr
  };
}

// 删除ftr相关的状态
export function deleteFtrState(getState: IGetState, ftrId: string) {
  const state = { ...getState() };
  if (state.hoverFtr === ftrId) {
    state.hoverFtr = null;
  }
  state.selectedFtrs = state.selectedFtrs.filter((id) => id !== ftrId);
  state.highLightFtrs = state.highLightFtrs.filter((p) => p.ftrId === ftrId);
  if (state.mouseInFtr === ftrId) {
    state.mouseInFtr = null;
  }

  const ftrStyles = { ...state.ftrStyles };
  delete ftrStyles[ftrId];
  state.ftrStyles = ftrStyles;

  return state;
}

// 移除我的高亮
export function deleteHighLightFtr(getState: IGetState) {
  const { highLightFtrs, config } = getState();
  const nextHighLightFtrs = highLightFtrs.filter((p) => p.id !== config.id);
  return {
    ...getState(),
    highLightFtrs: nextHighLightFtrs
  };
}

// 高亮我的
export function sethighLightFtr(getState: IGetState, ftrId: string) {
  let highLightFtrs = [...getState().highLightFtrs];
  highLightFtrs = highLightFtrs.filter((p) => p.id !== getState().config.id);
  highLightFtrs.push({
    color: getState().config.color,
    id: getState().config.id,
    ftrId
  });
  return {
    ...getState(),
    highLightFtrs
  };
}

// 更新dragCompStyle
export function updateDragCompSize(getState: IGetState, param: IGrag.ISize) {
  let dragCompStyle = getState().dragCompStyle;
  if (dragCompStyle) {
    dragCompStyle = { ...dragCompStyle, ...param };
  } else {
    dragCompStyle = {
      width: Math.floor(param.width),
      height: Math.floor(param.height),
      x: 0, y: 0
    };
  }
  return {
    ...getState(),
    dragCompStyle
  };
}

// 准备resize
export function readyResize(getState: IGetState, resizeType: IGrag.IResizeType) {
  return {
    ...getState(),
    beforeChangeFtrStyles: { ...getState().ftrStyles },
    resizeType,
  };
}

// 更新hoverFtr
export function updateHoverFtr(getState: IGetState, ftrId: string) {
  return {
    ...getState(),
    hoverFtr: ftrId
  };
}

// 更新选中的ftr
export function updateSelectedFtrs(getState: IGetState, ftrIds: string[]) {
  return {
    ...getState(),
    selectedFtrs: ftrIds
  };
}
