import * as util from '@/lib/util';
import type { ICtx } from './index';
import type { IState } from './state';

// 鼠标坐标改变
export function mouseCoordChange({ getState, doAction }: ICtx, param: { coord: IGrag.IXYCoord; canvasId: string; }) {
  doAction('updateMouseCoord', param);
  doAction('dragging');
  doAction('moving');
  doAction('recting');
  doAction('resizing');
  doAction('updateBorder');
  doAction('updateGuides');
  return getState();
}

// 更新mouseCoord
export function updateMouseCoord({ getState }: ICtx, param: { coord: IGrag.IXYCoord; canvasId: string; }) {
  const { coord, canvasId } = param;
  const state = { ...getState(), focusedCanvas: canvasId };
  // 计算 mouseCoord
  const canvasRect = state.canvasRects[canvasId];
  const mouseCoord = {
    x: coord.x - canvasRect.x,
    y: coord.y - canvasRect.y
  };
  state.mouseCoord = mouseCoord;
  return state;
}

// dragging
export function dragging({ getState }: ICtx) {
  const state = getState();
  // 计算拖拽的compState
  if (state.dragCompStyle && state.hoverFtr) {
    const { width, height } = state.dragCompStyle;
    state.dragCompStyle = {
      width, height,
      x: state.mouseCoord.x - Math.floor(width / 2),
      y: state.mouseCoord.y - Math.floor(height / 2),
    };
    state.border = util.calRectByStyle(state.dragCompStyle);
  }
  return state;
}

// moveing
export function moving({ getState }: ICtx) {
  const state = getState();
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
  return state;
}

// 框选
export function recting({ getState, globalStore }: ICtx) {
  const state = getState();
  // 框选
  if (!state.resizeType && !state.isMoving && state.isMousedown && !state.mouseInFtr && state.focusedCanvas) {
    state.isMoving = false;
    const rootId = globalStore.getRoot(state.focusedCanvas).ftrId;
    const nodes = globalStore.getDeepChildren(rootId);
    const selectedFtrs = util.calSelectedFtrs(
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
    state.box = {
      x: rectx, y: recty,
      width: Math.abs(state.mouseCoord.x - state.mousedownCoord.x),
      height: Math.abs(state.mouseCoord.y - state.mousedownCoord.y),
    };
  }
  return state;
}

// resize
export function resizing({ getState }: ICtx) {
  const state = getState();
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
  return state;
}

// 更新border
export function updateBorder({ getState }: ICtx) {
  const state = getState();
  // 计算边框
  if (state.box || state.resizeType || state.isMoving) {
    state.border = util.calMaxBox(state.selectedFtrs.map((id) => state.ftrStyles[id]));
  }
  return state;
}

// 更新guides
export function updateGuides({ getState, globalStore }: ICtx) {
  const adsorbDist = 5;
  const state = getState();
  if ((state.resizeType || state.isMoving || state.dragCompStyle) && state.border) {
    const closestStyles: Partial<Record<IGrag.ISides, IGrag.IStyle>> = {};
    state.adsorbLines = {};
    state.distLines = {};
    state.dashLines = {};
    const type2Key: Record<IGrag.IAdsorptionType, 'x' | 'y'> = {
      ht: 'x', hm: 'x', hb: 'x',
      vl: 'y', vm: 'y', vr: 'y'
    };
    const type2Dist: Record<IGrag.IAdsorptionType, Array<IGrag.ISides>> = {
      ht: ['left', 'right'], hm: ['left', 'right'], hb: ['left', 'right'],
      vl: ['top', 'bottom'], vm: ['top', 'bottom'], vr: ['top', 'bottom']
    };

    let parent: IGrag.IFtrNode | null = null;
    if (state.dragCompStyle) {
      // 正在drag时的parent为hoverftr
      parent = globalStore.getNodeByFtrId(state.hoverFtr!);
    } else {
      const nodes = state.selectedFtrs.map((id) => globalStore.getNodeByFtrId(id)!);
      parent = nodes.length === 1 ? util.getParentNode(nodes[0]) : util.lowestCommonAncestor(nodes);
    }
    if (parent) {
      const childs = [parent, ...util.getChildren(parent)];
      childs.forEach(({ ftrId }) => {
        if (!state.selectedFtrs.includes(ftrId)) {
          const style = globalStore.getFtrStyle(ftrId);
          const target = {
            y: [style.y, style.y + style.height / 2, style.y + style.height],
            x: [style.x, style.x + style.width / 2, style.x + style.width]
          };
          const border = {
            y: {
              ht: state.border!.lt.y,
              hm: (state.border!.lt.y + state.border!.rb.y) / 2,
              hb: state.border!.rb.y,
            },
            x: {
              vl: state.border!.lt.x,
              vm: (state.border!.lt.x + state.border!.rb.x) / 2,
              vr: state.border!.rb.x
            }
          };
          const match = { y: true, x: true };
          Object.keys(target).forEach((k) => {
            target[k].forEach((s) => {
              Object.keys(border[k]).forEach((type: IGrag.IAdsorptionType) => {
                // resize时不考虑hm、vm
                if (!(state.resizeType && (type === 'hm' || type === 'vm'))) {
                  const v: number = (border as any)[k][type];
                  const delt = Math.abs(s - v);
                  if ((state.dragCompStyle && delt === 0) || (!state.dragCompStyle && delt < adsorbDist)) {
                    if (match[k] && !state.dragCompStyle) {
                      if (state.resizeType) {
                        state.selectedFtrs.forEach((id) => {
                          state.ftrStyles[id] = util.calResizeStyle(
                            state.resizeType!, state.ftrStyles[id],
                            {
                              deltX: k === 'x' ? s - v : 0,
                              deltY: k === 'y' ? s - v : 0
                            }
                          );
                        });
                      } else {
                        state.selectedFtrs.forEach((id) => {
                          state.ftrStyles[id][k] += s - v;
                        });
                      }
                      state.border = util.calMaxBox(state.selectedFtrs.map((id) => state.ftrStyles[id]));
                      match[k] = false;
                    }
                    const xy = type2Key[type];
                    const widthHeight = xy === 'x' ? 'width' : 'height';

                    // 对齐线
                    state.adsorbLines[type] = [
                      Math.min(style[xy], state.adsorbLines[type] ? state.adsorbLines[type]![0] : Infinity),
                      Math.max(style[xy] + (xy === 'x' ? style.width : style.height), state.adsorbLines[type] ? state.adsorbLines[type]![1] : -Infinity)
                    ];

                    // 最近的ftr
                    type2Dist[type].forEach((side) => {
                      if (side === 'left' || side === 'top') {
                        const p = style[xy] + style[widthHeight];
                        const distDelt = state.border!.lt[xy] - p;
                        if (distDelt >= adsorbDist) {
                          if (!closestStyles[side] || (closestStyles[side]![xy] + closestStyles[side]![widthHeight] < p)) {
                            closestStyles[side] = style;
                          }
                        }
                      }
                      if (side === 'right' || side === 'bottom') {
                        const distDelt = style[xy] - state.border!.rb[xy];
                        if (distDelt >= adsorbDist) {
                          if (!closestStyles[side] || (style[xy] < closestStyles[side]![xy])) {
                            closestStyles[side] = style;
                          }
                        }
                      }
                    });

                  }
                }
              });
            });
          });
        }
      });
      // border计算完成后重新计算adsorbLines
      Object.keys(state.adsorbLines).forEach((type) => {
        const key = type2Key[type];
        state.adsorbLines[type] = [
          Math.min(state.border!.lt[key], state.adsorbLines[type] ? state.adsorbLines[type]![0] : Infinity),
          Math.max(state.border!.rb[key], state.adsorbLines[type] ? state.adsorbLines[type]![1] : -Infinity)
        ];
      });

      // 根据最近的ftrstyle计算distLines
      Object.keys(closestStyles).forEach((side) => {
        const xy = (side === 'left' || side === 'right') ? 'x' : 'y';
        const widthHeight = xy === 'x' ? 'width' : 'height';
        if (side === 'left' || side === 'top') {
          state.distLines[side] = state.border!.lt[xy] - closestStyles[side]![widthHeight] - closestStyles[side]![xy];
        }
        if (side === 'right' || side === 'bottom') {
          state.distLines[side] = closestStyles[side]![xy] - state.border!.rb[xy];
        }
      });

      // 根据最近的ftrstyle计算dashlines
      Object.keys(closestStyles).forEach((side) => {
        const xy = (side === 'left' || side === 'right') ? 'y' : 'x';
        const widthHeight = xy === 'x' ? 'width' : 'height';
        const mid = (state.border!.lt[xy] + state.border!.rb[xy]) / 2;
        if (mid > closestStyles[side]![xy] + closestStyles[side]![widthHeight]) {
          state.dashLines[side] = [closestStyles[side]![xy] + closestStyles[side]![widthHeight], state.border!.rb[xy]];
        } else if (mid < closestStyles[side]![xy]) {
          state.dashLines[side] = [state.border!.lt[xy], closestStyles[side]![xy]];
        } else {
          delete state.dashLines[side];
        }
      });
    }
  }
  return state;
}

// 批量更新ftrStyle
export function updateFtrStyles({ getState }: ICtx, param: { ftrId: string; style: IGrag.IStyle; }[]) {
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
    box: null,
    beforeChangeFtrStyles: { ...state.ftrStyles }
  };
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
    box: null,
    isMousedown: false,
    resizeType: null,
    adsorbLines: {},
    distLines: {},
    dashLines: {},
    dragCompStyle: null,
    hoverFtr: null,
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
    adsorbLines: {},
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
    border: ftrIds.length ? util.calMaxBox(ftrIds.map((id) => globalStore.getFtrStyle(id))) : null
  };
}

// 更新state
export function updateState({ getState }: ICtx, state: Partial<IState>) {
  return {
    ...getState(),
    ...state
  };
}
