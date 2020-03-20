import * as util from '@/lib/util';
import type { ICtx } from './index';
import type { IState } from './state';

// 更新state
export function updateState({ getState }: ICtx, state: Partial<IState>) {
  return {
    ...getState(),
    ...state
  };
}

// 批量更新ftrStyle
export function updateFtrStyles({ getState }: ICtx, param: { ftrId: string; style: IGrag.IFtrStyle; }[]) {
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
export function readyMoving({ getState }: ICtx) {
  const state = { ...getState() };
  return {
    ...state,
    isMoving: true,
    rect: null,
    beforeChangeFtrStyles: { ...state.ftrStyles }
  };
}

// 鼠标坐标改变
export function mouseCoordChange({ getState, globalStore }: ICtx, param: { coord: IGrag.IXYCoord; canvasId: string; }) {
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

  // 计算移动后的ftr
  if (state.isMoving && state.selectedFtrs.length) {
    const deltX = state.mouseCoord.x - state.mousedownCoord.x;
    const deltY = state.mouseCoord.y - state.mousedownCoord.y;
    state.selectedFtrs.forEach((id) => {
      const { x, y, width, height } = state.beforeChangeFtrStyles[id];
      state.ftrStyles[id] = {
        x: x + deltX,
        y: y + deltY,
        width, height
      };
    });
  }

  // 框选
  if (!state.resizeType && !state.isMoving && state.isMousedown && !state.mouseInFtr && state.focusedCanvas) {
    state.isMoving = false;
    const rootId = globalStore.getRoot(state.focusedCanvas).ftrId;
    const nodes = globalStore.getDeepChildren(rootId);
    const selectedFtrs = util.calRectFtrs(
      state.mouseCoord, state.mousedownCoord,
      nodes.map(({ ftrId }) => ({ ftrId, ...globalStore.getFtrStyle(ftrId) }))
    );
    state.selectedFtrs = selectedFtrs;

    let rectx = 0;
    let recty = 0;
    const isRight = state.mouseCoord.x > state.mousedownCoord.x;
    const isBottom = state.mouseCoord.y > state.mousedownCoord.y;
    if (isRight) {
      rectx = state.mousedownCoord.x;
    } else {
      rectx = state.mouseCoord.x;
    }
    if (isBottom) {
      recty = state.mousedownCoord.y;
    } else {
      recty = state.mouseCoord.y;
    }
    state.rect = {
      x: rectx, y: recty,
      width: Math.abs(state.mouseCoord.x - state.mousedownCoord.x),
      height: Math.abs(state.mouseCoord.y - state.mousedownCoord.y),
    };
  }

  // 计算resize后的ftr
  if (state.resizeType && state.selectedFtrs.length) {
    const deltX = state.mouseCoord.x - state.mousedownCoord.x;
    const deltY = state.mouseCoord.y - state.mousedownCoord.y;
    state.selectedFtrs.forEach((id) => {
      const style = util.calResizeStyle(
        state.resizeType!, state.beforeChangeFtrStyles[id],
        { deltX, deltY }
      );
      if (style.width > 1 && style.height > 1) {
        state.ftrStyles[id] = style;
      }
    });
  }

  // 计算边框
  if (state.rect || state.resizeType || state.isMoving) {
    state.border = util.calRect(state.selectedFtrs.map((id) => state.ftrStyles[id]));
  }

  // 计算guides
  if ((state.resizeType || state.isMoving) && state.border) {
    state.adsorbLines = {};
    const nodes = state.selectedFtrs.map((id) => globalStore.getNodeByFtrId(id)!);
    const parent = nodes.length === 1 ? util.getParentNode(nodes[0]) : util.lowestCommonAncestor(nodes);
    if (parent) {
      const childs = util.getChildren(parent);
      childs.forEach(({ ftrId }) => {
        if (!state.selectedFtrs.includes(ftrId)) {
          const style = globalStore.getFtrStyle(ftrId);
          if (Math.abs(style.y - state.border!.lt.y) < 5) {
            state.selectedFtrs.forEach((id) => {
              state.ftrStyles[id].y += style.y - state.border!.lt.y;
            });
            state.border = util.calRect(state.selectedFtrs.map((id) => state.ftrStyles[id]));
            state.adsorbLines.ht = [
              Math.min(state.border!.lt.x, style.x, state.adsorbLines.ht ? state.adsorbLines.ht[0] : Infinity),
              Math.max(state.border!.rb.x, style.x + style.width, state.adsorbLines.ht ? state.adsorbLines.ht[1] : -Infinity)
            ];
          }
        }
      });
    }
  }

  return state;
}

// 聚焦canvas
export function focusedCanvas({ getState }: ICtx, canvsId: string) {
  return {
    ...getState(),
    focusedCanvas: canvsId
  };
}

// 失焦canvas
export function blurCanvas({ getState }: ICtx) {
  return {
    ...getState(),
    focusedCanvas: null
  };
}

// 清除当前动作（移动ftr、拉框选择、resizeftr...）
export function clearAction({ getState }: ICtx) {
  return {
    ...getState(),
    isMoving: false,
    rect: null,
    isMousedown: false,
    resizeType: null
  };
}

// 置为鼠标down
export function setMousedown({ getState }: ICtx) {
  return {
    ...getState(),
    isMousedown: true,
    mousedownCoord: getState().mouseCoord
  };
}

// 清除选中的ftr
export function clearSelectedFtrs({ getState }: ICtx) {
  return {
    ...getState(),
    selectedFtrs: [],
    border: null
  };
}

// 更新canvas的rect
export function updateCanvasRect({ getState }: ICtx, param: { id: string; rect: DOMRect; }) {
  return {
    ...getState(),
    canvasRects: {
      ...getState().canvasRects,
      [param.id]: param.rect
    }
  };
}

// 清除drag的状态
export function clearDragState({ getState }: ICtx) {
  return {
    ...getState(),
    dragCompStyle: null,
    hoverFtr: null
  };
}

// 更新mouseInFtr
export function updateMouseInFtr({ getState }: ICtx, mouseInFtr: string | null) {
  return {
    ...getState(),
    mouseInFtr
  };
}

// 删除ftr相关的状态
export function deleteFtrState({ getState }: ICtx, ftrId: string) {
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
export function deleteHighLightFtr({ getState }: ICtx) {
  const { highLightFtrs, config } = getState();
  const nextHighLightFtrs = highLightFtrs.filter((p) => p.id !== config.id);
  return {
    ...getState(),
    highLightFtrs: nextHighLightFtrs
  };
}

// 高亮我的
export function sethighLightFtr({ getState }: ICtx, ftrId: string) {
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
export function updateDragCompSize({ getState }: ICtx, param: IGrag.ISize) {
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
export function readyResize({ getState }: ICtx, resizeType: IGrag.IResizeType) {
  return {
    ...getState(),
    beforeChangeFtrStyles: { ...getState().ftrStyles },
    resizeType,
  };
}

// 更新hoverFtr
export function updateHoverFtr({ getState }: ICtx, ftrId: string) {
  return {
    ...getState(),
    hoverFtr: ftrId
  };
}

// 更新选中的ftr
export function updateSelectedFtrs({ getState, globalStore }: ICtx, ftrIds: string[]) {
  return {
    ...getState(),
    selectedFtrs: ftrIds,
    border: ftrIds.length ? util.calRect(ftrIds.map((id) => globalStore.getFtrStyle(id))) : null
  };
}
