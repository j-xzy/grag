import * as util from '@/lib/util';
import type { ICtx } from './index';
import type { IState } from './state';

// 鼠标坐标改变
export function mousePosChange({ getState, doAction }: ICtx, param: { pos: IGrag.IPos; canvasId: string; }) {
  doAction('updateMousePos', param);
  doAction('dragging');
  doAction('moving');
  doAction('Boxing');
  doAction('resizing');
  doAction('rotating');

  if (getState().selectBox || getState().resize || getState().isMoving || getState().isRotate) {
    doAction('updateBorder');
  }

  if (getState().resize || getState().isMoving) {
    doAction('updateGuides');
  }
  return getState();
}

// 更新mouseCoord
export function updateMousePos({ getState }: ICtx, param: { pos: IGrag.IPos; canvasId: string; }) {
  const { pos, canvasId } = param;
  const state = { ...getState(), focusedCanvas: canvasId };
  // 计算 mousePos
  const canvasRect = state.canvasRects[canvasId];
  const mousePos = util.roundObj({
    x: pos.x - canvasRect.x,
    y: pos.y - canvasRect.y
  });
  state.mousePos = mousePos;
  return state;
}

// dragging
export function dragging({ getState }: ICtx) {
  const state = getState();
  // 计算拖拽的compState
  if (state.dragCompStyle && state.hoverFtr) {
    const { width, height } = state.dragCompStyle;
    state.dragCompStyle = util.roundObj({
      width: width,
      height: height,
      x: state.mousePos.x - Math.floor(width / 2),
      y: state.mousePos.y - Math.floor(height / 2),
      rotate: 0
    });
    state.border = state.dragCompStyle;
  }
  return state;
}

// moveing
export function moving({ getState }: ICtx) {
  const state = getState();
  // 计算移动后的ftr
  if (state.isMoving && state.selectedFtrs.length) {
    const deltX = state.mousePos.x - state.mousedownPos.x;
    const deltY = state.mousePos.y - state.mousedownPos.y;
    state.selectedFtrs.forEach((id) => {
      const { x, y, width, height, rotate } = state.beforeChangeFtrStyles[id];
      state.ftrStyles[id] = util.roundObj({
        x: x + deltX,
        y: y + deltY,
        width: width,
        height: height,
        rotate
      });
    });
  }
  return state;
}

// 框选
export function Boxing({ getState, globalStore }: ICtx) {
  const state = getState();
  // 框选
  if (!state.resize && !state.isMoving && !state.isRotate && state.isMousedown && !state.mouseInFtr && state.focusedCanvas) {
    state.isMoving = false;
    const rootId = globalStore.getRoot(state.focusedCanvas).ftrId;
    const nodes = globalStore.getDeepChildren(rootId);
    const selectedFtrs = util.calSelectedFtrs(
      state.mousePos, state.mousedownPos,
      nodes.map(({ ftrId }) => ({ ftrId, ...globalStore.getFtrBoundRect(ftrId) }))
    );
    state.selectedFtrs = selectedFtrs;

    let rectx = 0;
    let recty = 0;
    const isRight = state.mousePos.x > state.mousedownPos.x;
    const isBottom = state.mousePos.y > state.mousedownPos.y;
    if (isRight) {
      rectx = state.mousedownPos.x;
    } else {
      rectx = state.mousePos.x;
    }
    if (isBottom) {
      recty = state.mousedownPos.y;
    } else {
      recty = state.mousePos.y;
    }
    state.selectBox = util.roundObj({
      x: rectx, y: recty,
      width: Math.abs(state.mousePos.x - state.mousedownPos.x),
      height: Math.abs(state.mousePos.y - state.mousedownPos.y),
      rotate: 0
    });
  }
  return state;
}

// resize
export function resizing({ getState }: ICtx) {
  const state = getState();
  // 计算resize后的ftr
  if (state.resize && state.selectedFtrs.length) {
    state.selectedFtrs.forEach((id) => {
      const style = util.roundObj(util.calResizeStyle(
        state.resize!.idx, state.beforeChangeFtrStyles[id],
        state.mousePos, state.mousedownPos
      ));
      if (style.width > 1 && style.height > 1) {
        state.ftrStyles[id] = style;
      }
    });
  }
  return state;
}

// 旋转
export function rotating({ getState, globalStore }: ICtx) {
  const state = getState();
  if (state.isRotate && state.isMousedown && state.selectedFtrs.length) {
    state.selectedFtrs.forEach((id) => {
      const center = util.calRectCenter(globalStore.getFtrBoundRect(id));
      const a = {
        x: state.mousePos.x - center.x,
        y: state.mousePos.y - center.y
      };
      const b = {
        x: state.mousedownPos.x - center.x,
        y: state.mousedownPos.y - center.y
      };
      let deg = util.rad2Deg(util.calAngleByVectors(a, b));
      // 外积
      const z = b.x * a.y - a.x * b.y;
      if (z < 0) {
        deg = 360 - deg;
      }
      deg = (deg + state.beforeChangeFtrStyles[id].rotate) % 360;
      if (deg > 355 || deg < 5) {
        deg = 0;
      }
      if (deg > 85 && deg < 95) {
        deg = 90;
      }
      if (deg > 175 && deg < 185) {
        deg = 180;
      }
      if (deg > 265 && deg < 275) {
        deg = 270;
      }
      state.ftrStyles[id] = util.roundObj({
        ...state.ftrStyles[id],
        rotate: deg
      });
    });
  }
  return state;
}

// 更新border
export function updateBorder({ getState }: ICtx) {
  const state = getState();
  // 计算边框
  if (state.selectedFtrs.length === 1) {
    state.border = state.ftrStyles[state.selectedFtrs[0]];
  } else if (state.selectedFtrs.length > 1) {
    state.border = {
      ...util.calMaxRect(state.selectedFtrs.map((id) => util.style2MaxRect(state.ftrStyles[id]))),
      rotate: 0
    };
  }
  return state;
}

// 更新Guide
export function updateGuides({ getState, globalStore, doAction }: ICtx) {
  const state = getState();
  state.guideBlocks = [];
  state.guideLines = [];

  if (!state.selectedFtrs.length || !state.border) {
    return state;
  }

  // 计算旋转后的最大矩形
  let rect = util.style2MaxRect(state.border);

  // 找到父亲节点
  const nodes = state.selectedFtrs.map((id) => globalStore.getNodeByFtrId(id)!);
  const parent = nodes.length === 1 ? util.getParentNode(nodes[0]) : util.lowestCommonAncestor(nodes);
  if (!parent) {
    return state;
  }

  const children = util.getChildren(parent).filter(({ ftrId }) => !state.selectedFtrs.includes(ftrId));

  const alignPairs: [number[][], number[][]] = [[],[]];
  //#region 对齐线
  updateAlign({
    x: 'x', y: 'y',
    width: 'width',
    height: 'height'
  });

  updateAlign({
    x: 'y', y: 'x',
    width: 'height',
    height: 'width'
  });

  // 更新border、rect
  doAction('updateBorder');
  rect = util.style2MaxRect(state.border!);
  //#endregion

  const closestRects: IGrag.IRect[] = [];
  //#region block
  if (!state.resize || state.border.rotate === 0) {
    // 不考虑resize且有旋转
    updateBlocks({
      x: 'x', y: 'y',
      width: 'width',
      height: 'height'
    });

    updateBlocks({
      x: 'y', y: 'x',
      width: 'height',
      height: 'width'
    });

    // 更新border、rect
    doAction('updateBorder');
    rect = util.style2MaxRect(state.border);
  }
  //#endregion

  const mateFtrs: Record<'width' | 'height', string[]> = { width: [], height: [] };
  //#region 等宽distline
  if (state.resize) {
    const dimensions: Array<'width' | 'height'> = [];
    if (state.border.rotate !== 0 || ['nw', 'ne', 'sw', 'se'].includes(state.resize.type)) {
      dimensions.push('width', 'height');
    } else if (['n', 's'].includes(state.resize.type)) {
      dimensions.push('height');
    } else if (['w', 'e'].includes(state.resize.type)) {
      dimensions.push('width');
    }

    const minGap = { width: Infinity, height: Infinity };
    children.forEach(({ ftrId }) => {
      const target = util.style2MaxRect(state.ftrStyles[ftrId]);
      dimensions.forEach((dim) => {
        const gap = target[dim] - rect[dim];
        // 差小于贴附距离 且 绝对差最小
        if (Math.abs(gap) < state.attachDist && Math.abs(minGap[dim]) > Math.abs(gap)) {
          minGap[dim] = gap;
          mateFtrs[dim] = [ftrId];
        } else if (minGap[dim] === gap) {
          mateFtrs[dim].push(ftrId);
        }
      });
    });

    // 吸附
    state.selectedFtrs.forEach((id) => {
      dimensions.forEach((dim) => {
        if (Number.isFinite(minGap[dim])) {
          state.ftrStyles[id][dim] += minGap[dim];
          const xy = dim === 'height' ? 'y' : 'x';
          if (['w', 'n', 'nw'].includes(state.resize!.type)) {
            state.ftrStyles[id][xy] -= minGap[dim];
          } else if (state.resize!.type === 'ne' && xy === 'y') {
            state.ftrStyles[id][xy] -= minGap[dim];
          } else if (state.resize!.type === 'sw' && xy === 'x') {
            state.ftrStyles[id][xy] -= minGap[dim];
          }
        }
      });
    });

    // 更新border、rect
    doAction('updateBorder');
    rect = util.style2MaxRect(state.border);
  }
  //#endregion

  // 最后更新依赖selectedFtr的guide
  closestRects.forEach((r) => {
    const { block, line } = util.calGuideBlockLine(r, rect);
    state.guideBlocks.push(block);
    state.guideLines.push(...line);
  });

  Object.keys(mateFtrs).forEach((wh) => {
    mateFtrs[wh].forEach((id) => {
      const rect = util.style2MaxRect(state.ftrStyles[id]);
      state.guideLines.push({
        type: 'dist',
        direction: wh === 'width' ? 'horizontal' : 'vertical',
        length: rect[wh],
        pos: {
          x: rect.x,
          y: rect.y
        },
        showText: false,
        offset: -6
      });
    });
    if (mateFtrs[wh].length > 0) {
      state.guideLines.push({
        type: 'dist',
        direction: wh === 'width' ? 'horizontal' : 'vertical',
        length: rect[wh],
        pos: { x: rect.x, y: rect.y },
        offset: -6
      });
    }
  });

  alignPairs.forEach((align, alIdx) => {
    align.forEach(([l, r], idx) => {
      let x = 0; let y = 0; let length = 0;
      if (alIdx === 0) {
        y = util.rectAlignLines(rect)[0][idx];
        x = Math.min(l, rect.x);
        length = Math.max(rect.x + rect.width, r) - x;
      } else {
        x = util.rectAlignLines(rect)[1][idx];
        y = Math.min(l, rect.y);
        length = Math.max(rect.y + rect.height, r) - y;
      }
      if (Number.isFinite(l) || Number.isFinite(r)) {
        state.guideLines.push({
          type: 'align',
          pos: { x, y },
          direction: alIdx === 0 ? 'horizontal' : 'vertical',
          length,
        });
      }
    });
  });

  // 更新guideBlock
  function updateBlocks(kM: IGrag.IIndexable<keyof IGrag.IRect>) {
    if (state.resize && kM.x === 'y' && ['w', 'e'].includes(state.resize.type)) {
      return;
    }
    if (state.resize && kM.x === 'x' && ['n', 's'].includes(state.resize.type)) {
      return;
    }
    const blockFtrTuples: Array<[IGrag.IRect, IGrag.IRect]> = [];
    //交叉的ftr
    const crossFtrs: Array<{ ftrId: string; dist: number; }> = [];

    children.forEach(({ ftrId }) => {
      const brotherRect = globalStore.getFtrBoundRect(ftrId);
      if (util.isCoincide([rect, brotherRect], kM.x === 'x' ? 'horizontal' : 'vertical')) {
        // 水平方向上有交集
        return;
      }
      if (!util.isCoincide([rect, brotherRect], kM.x === 'x' ? 'vertical' : 'horizontal')) {
        // 垂直方向上无交集
        return;
      }
      const v1 = rect[kM.x] - brotherRect[kM.x] - brotherRect[kM.width];
      const v2 = rect[kM.x] + rect[kM.width] - brotherRect[kM.x];
      const crossFtr = Math.abs(v1) > Math.abs(v2) ? { ftrId, dist: v2 } : { ftrId, dist: v1 };
      crossFtrs.push(crossFtr);
    });

    if (crossFtrs.length < 1) {
      return;
    }

    // 从大到小、从左到右排序（正位于ftr左，负位于ftr右）
    crossFtrs.sort((a, b) => b.dist - a.dist);

    // 合并相等dist
    const crossRects: Array<{ dist: number; rect: IGrag.IRect; }> = [];
    let slowIdx = 0;
    let fastIdx = 1;
    while (slowIdx < crossFtrs.length) {
      crossRects.push({
        dist: crossFtrs[slowIdx].dist,
        rect: util.style2MaxRect(state.ftrStyles[crossFtrs[slowIdx].ftrId])
      });
      while (fastIdx < crossFtrs.length && crossFtrs[fastIdx].dist === crossFtrs[slowIdx].dist) {
        crossRects[crossRects.length - 1].rect = util.calMaxRect([
          crossRects[crossRects.length - 1].rect,
          util.style2MaxRect(state.ftrStyles[crossFtrs[fastIdx].ftrId])
        ]);
        ++fastIdx;
      }
      slowIdx = fastIdx;
      ++fastIdx;
    }

    // 距选中ftr最近的ftr
    const closestFtrs: Array<{ rect: IGrag.IRect; dist: number; }> = [];

    if (crossRects[0].dist < 0) {
      // 第一个就小于0，代表选中ftr位于最左
      const k = Math.abs(crossRects[0].dist);
      closestFtrs[1] = { ...crossRects[0], dist: k };
    }
    if (crossRects[crossRects.length - 1].dist > 0) {
      // 最后一个大于0，代表选中ftr位于最右
      const k = Math.abs(crossRects[crossRects.length - 1].dist);
      closestFtrs[0] = { ...crossRects[crossRects.length - 1], dist: k };
    }

    // ftrIds: 两个距离（dist）最近且交集的ftr
    const spanRects: Array<{ rects: [IGrag.IRect, IGrag.IRect]; dist: number; }> = [];

    for (let n = 0; n < crossRects.length - 1; ++n) {
      for (let m = n + 1; m < crossRects.length; ++m) {
        const a = crossRects[n];
        const b = crossRects[m];
        const aStyle = a.rect;
        const bStyle = b.rect;
        if (m - n === 1 && a.dist * b.dist <= 0) {
          // a位于选中ftr左，b右
          closestFtrs[0] = { dist: Math.abs(a.dist), rect: aStyle };
          closestFtrs[1] = { dist: Math.abs(b.dist), rect: bStyle };
          break;
        }
        if (a.dist * b.dist <= 0 && m - n !== 1) {
          // 越过了
          break;
        }
        if (!util.isCoincide([aStyle, bStyle], kM.x === 'x' ? 'vertical' : 'horizontal')) {
          // 垂直方向上无交集
          continue;
        }
        let dist = a.dist - b.dist - bStyle[kM.width];
        if (a.dist < 0) {
          dist = a.dist - b.dist - aStyle[kM.width];
        }
        if (dist > 0) {
          spanRects.push({ dist, rects: [aStyle, bStyle] });
          break;
        }
      }
    }

    const dists = [closestFtrs[0]?.dist ?? Infinity, closestFtrs[1]?.dist ?? Infinity];
    if (dists.every((n) => n === Infinity)) {
      return;
    }

    let attachDist = state.attachDist;
    let closestIdxs: Set<number> = new Set();
    // 左右之差小于attachDist 且 能被平分
    if (Math.abs(dists[0] - dists[1]) < attachDist && (dists[0] + dists[1]) % 2 === 0) {
      const avg = (dists[0] + dists[1]) / 2;
      // 贴附
      state.selectedFtrs.forEach((id) => {
        const k = kM.x;
        state.ftrStyles[id] = {
          ...state.ftrStyles[id],
          [k]: state.ftrStyles[id][k] - dists[0] + avg
        };
      });

      attachDist = 0;
      closestFtrs[0].dist = avg;
      closestFtrs[1].dist = avg;
      closestIdxs.add(0);
      closestIdxs.add(1);
    }

    // key为距离差
    const diffObj: IGrag.IIndexable<Array<{ rects: [IGrag.IRect, IGrag.IRect]; idx: number; }>> = {};
    let minDist = Infinity;
    let minIdx = 0;

    spanRects.forEach((span) => {
      closestFtrs.forEach((item, idx) => {
        if (idx === 1 && closestFtrs[0] && closestFtrs[1]
          && closestFtrs[0].dist === closestFtrs[1].dist
        ) {
          // 左右相同跳过避免重复
          return;
        }

        const d = span.dist - item.dist;
        if (Math.abs(d) > attachDist) {
          return;
        }
        if (Math.abs(d) < minDist) {
          closestIdxs = new Set([idx]);
          minDist = d;
          minIdx = idx;
        }
        if (Math.abs(d) === minDist) {
          closestIdxs.add(idx);
        }

        !diffObj[d] && (diffObj[d] = []);
        diffObj[d].push({
          rects: span.rects,
          idx
        });
      });
    });

    // 未找到距离差相等
    if (!Number.isFinite(minDist)) {
      // 推入closestRects
      closestIdxs.forEach((i) => {
        closestRects.push(closestFtrs[i].rect);
      });
      return;
    }

    if (state.resize) {
      // 过滤非同侧
      if (kM.x === 'y') {
        if (['sw', 's', 'se'].includes(state.resize.type)) {
          diffObj[minDist] = diffObj[minDist].filter(({ idx }) => idx !== 0);
          closestIdxs.delete(0);
        }
        if (['nw', 'n', 'ne'].includes(state.resize.type)) {
          diffObj[minDist] = diffObj[minDist].filter(({ idx }) => idx !== 1);
          closestIdxs.delete(1);
        }
      } else {
        if (['ne', 'e', 'se'].includes(state.resize.type)) {
          diffObj[minDist] = diffObj[minDist].filter(({ idx }) => idx !== 0);
          closestIdxs.delete(0);
        }
        if (['nw', 'w', 'sw'].includes(state.resize.type)) {
          diffObj[minDist] = diffObj[minDist].filter(({ idx }) => idx !== 1);
          closestIdxs.delete(1);
        }
      }
    }

    blockFtrTuples.push(...diffObj[minDist].map(({ rects }) => rects));

    if (!state.resize) {
      closestIdxs.add(minIdx);
    }

    // 贴附偏移距离
    const diff = minDist * (minIdx === 0 ? 1 : -1);

    // 贴附后 且 存在
    if (minDist !== 0 && diffObj[0 - minDist]) {
      // 左右距离相等就不追加block
      if (!(closestFtrs[0] && closestFtrs[1]
        && (closestFtrs[minIdx].dist + diff === closestFtrs[minIdx ^ 1].dist - diff))
      ) {
        blockFtrTuples.push(...diffObj[0 - minDist].map(({ rects }) => rects));
        closestIdxs.add(minIdx ^ 1);
      }
    }

    // 左右相等
    if (closestFtrs[0] && closestFtrs[1] && (closestFtrs[0].dist + diff === closestFtrs[1].dist - diff)) {
      closestIdxs.add(0);
      closestIdxs.add(1);
    }

    // 推入closestRects
    closestIdxs.forEach((i) => {
      closestRects.push(closestFtrs[i].rect);
    });

    // 贴附
    const xy = kM.x;
    const wh = kM.width;
    if (state.resize) {
      if (['e', 's'].includes(state.resize.type)
        || (['sw', 'se'].includes(state.resize.type) && xy === 'y')
        || (['ne', 'se'].includes(state.resize.type) && xy === 'x')
      ) {
        state.selectedFtrs.forEach((id) => {
          state.ftrStyles[id] = {
            ...state.ftrStyles[id],
            [wh]: state.ftrStyles[id][wh] + diff,
            [xy]: state.ftrStyles[id][xy]
          };
        });
      } else if (['n', 'w'].includes(state.resize.type)
        || (['nw', 'ne'].includes(state.resize.type) && xy === 'y')
        || (['nw', 'sw'].includes(state.resize.type) && xy === 'x')
      ) {
        state.selectedFtrs.forEach((id) => {
          state.ftrStyles[id] = {
            ...state.ftrStyles[id],
            [wh]: state.ftrStyles[id][wh] - diff,
            [xy]: state.ftrStyles[id][xy] + diff
          };
        });
      }
    } else {
      state.selectedFtrs.forEach((id) => {
        state.ftrStyles[id] = {
          ...state.ftrStyles[id],
          [xy]: state.ftrStyles[id][xy] + diff
        };
      });
    }

    blockFtrTuples.forEach(([a, b]) => {
      const { block, line } = util.calGuideBlockLine(a, b);
      state.guideBlocks.push(block);
      state.guideLines.push(...line);
    });

  }

  // 更新alignLine
  function updateAlign(kM: IGrag.IIndexable<keyof IGrag.IRect>) {
    if (state.resize && kM.x === 'x' && ['w', 'e'].includes(state.resize.type)) {
      return;
    }
    if (state.resize && kM.x === 'y' && ['n', 's'].includes(state.resize.type)) {
      return;
    }
    const dists: IGrag.IIndexable<number[][]> = {};
    let minDist = Infinity;
    [parent!, ...children].forEach(({ ftrId }) => {
      const brotherRect = globalStore.getFtrBoundRect(ftrId);
      if (
        util.isCoincide([rect, brotherRect], kM.x === 'x' ? 'horizontal' : 'vertical', false)
        && ftrId !== parent!.ftrId
      ) {
        // 水平方向重叠
        return;
      }
      // 0:左, 1:右, -1: 包含
      const sideIdx = (brotherRect[kM.x] + brotherRect[kM.width]) <= rect[kM.x] ? 0
        : (rect[kM.x] + rect[kM.width] <= brotherRect[kM.x]) ? 1 : -1;
      const pos = sideIdx === 0 ? brotherRect[kM.x] : brotherRect[kM.x] + brotherRect[kM.width];
      const aligns = util.rectAlignLines(rect)[kM.x === 'x' ? 0 : 1];
      const brotherAligns = util.rectAlignLines(brotherRect)[kM.x === 'x' ? 0 : 1];
      aligns.forEach((source, idx) => {
        brotherAligns.forEach((target) => {
          const dist = target - source;
          if (Math.abs(dist) > state.attachDist) {
            return;
          }
          if (Math.abs(dist) < Math.abs(minDist)) {
            minDist = dist;
          }
          !dists[dist] && (
            dists[dist] = [
              [Infinity, -Infinity],
              [Infinity, -Infinity],
              [Infinity, -Infinity]
            ]
          );
          if (sideIdx === -1) {
            dists[dist][idx] = [
              Math.min(dists[dist][idx][0], brotherRect.x),
              Math.max(dists[dist][idx][1], brotherRect.x + brotherRect.width),
            ];
          } else {
            const minMax = sideIdx === 0 ? Math.min : Math.max;
            dists[dist][idx][sideIdx] = minMax(dists[dist][idx][sideIdx], pos);
          }
        });
      });
    });
    
    if (!Number.isFinite(minDist)) {
      return;
    }

    // 吸附
    const xy = kM.x === 'x' ? 'y' : 'x';
    const wh = kM.x === 'x' ? 'height' : 'width';
    if (state.resize) {
      if (['s'].includes(state.resize.type)) {
        state.selectedFtrs.forEach((id) => {
          state.ftrStyles[id] = {
            ...state.ftrStyles[id],
            height: state.ftrStyles[id].height + minDist
          };
        });
      }
      if (['n'].includes(state.resize.type)) {
        state.selectedFtrs.forEach((id) => {
          state.ftrStyles[id] = {
            ...state.ftrStyles[id],
            height: state.ftrStyles[id].height + minDist
          };
        });
      }
      
    } else {
      state.selectedFtrs.forEach((id) => {
        state.ftrStyles[id] = {
          ...state.ftrStyles[id],
          [xy]: state.ftrStyles[id][xy] + minDist
        };
      });
    }

    alignPairs[kM.x === 'x' ? 0 : 1] = dists[minDist];
  }

  return state;
}

// 更新guides
// export function updateGuidesBck({ getState, globalStore }: ICtx) {
//   const adsorbDist = 5;
//   const state = getState();
//   if ((state.resize || state.isMoving || state.dragCompStyle) && state.border) {
//     const closestStyles: Partial<Record<IGrag.ISides, IGrag.IStyle>> = {};
//     state.adsorbLines = {};
//     state.distLines = {};
//     state.dashLines = {};
//     const type2Key: Record<IGrag.IAdsorptionType, 'x' | 'y'> = {
//       ht: 'x', hm: 'x', hb: 'x',
//       vl: 'y', vm: 'y', vr: 'y'
//     };
//     const type2Dist: Record<IGrag.IAdsorptionType, Array<IGrag.ISides>> = {
//       ht: ['left', 'right'], hm: ['left', 'right'], hb: ['left', 'right'],
//       vl: ['top', 'bottom'], vm: ['top', 'bottom'], vr: ['top', 'bottom']
//     };

//     let parent: IGrag.IFtrNode | null = null;
//     if (state.dragCompStyle) {
//       // 正在drag时的parent为hoverftr
//       parent = globalStore.getNodeByFtrId(state.hoverFtr!);
//     } else {
//       const nodes = state.selectedFtrs.map((id) => globalStore.getNodeByFtrId(id)!);
//       parent = nodes.length === 1 ? util.getParentNode(nodes[0]) : util.lowestCommonAncestor(nodes);
//     }
//     if (parent) {
//       const childs = [parent, ...util.getChildren(parent)];
//       childs.forEach(({ ftrId }) => {
//         if (!state.selectedFtrs.includes(ftrId)) {
//           const style = globalStore.getFtrStyle(ftrId);
//           const target = {
//             y: [style.y, style.y + style.height / 2, style.y + style.height],
//             x: [style.x, style.x + style.width / 2, style.x + style.width]
//           };
//           const border = {
//             y: {
//               ht: state.border!.lt.y,
//               hm: (state.border!.lt.y + state.border!.rb.y) / 2,
//               hb: state.border!.rb.y,
//             },
//             x: {
//               vl: state.border!.lt.x,
//               vm: (state.border!.lt.x + state.border!.rb.x) / 2,
//               vr: state.border!.rb.x
//             }
//           };
//           const match = { y: true, x: true };
//           Object.keys(target).forEach((k) => {
//             target[k].forEach((s) => {
//               Object.keys(border[k]).forEach((type: IGrag.IAdsorptionType) => {
//                 // resize时不考虑hm、vm
//                 if (!(state.resize && (type === 'hm' || type === 'vm'))) {
//                   const v: number = (border as any)[k][type];
//                   const delt = Math.abs(s - v);
//                   if ((state.dragCompStyle && delt === 0) || (!state.dragCompStyle && delt < adsorbDist)) {
//                     if (match[k] && !state.dragCompStyle) {
//                       if (state.resize) {
//                         state.selectedFtrs.forEach((id) => {
//                           state.ftrStyles[id] = util.calResizeStyle(
//                             state.resize!, state.ftrStyles[id],
//                             {
//                               deltX: k === 'x' ? s - v : 0,
//                               deltY: k === 'y' ? s - v : 0
//                             }
//                           );
//                         });
//                       } else {
//                         state.selectedFtrs.forEach((id) => {
//                           state.ftrStyles[id][k] += s - v;
//                         });
//                       }
//                       state.border = util.calMaxBox(state.selectedFtrs.map((id) => state.ftrStyles[id]));
//                       match[k] = false;
//                     }
//                     const xy = type2Key[type];
//                     const widthHeight = xy === 'x' ? 'width' : 'height';

//                     // 对齐线
//                     state.adsorbLines[type] = [
//                       Math.min(style[xy], state.adsorbLines[type] ? state.adsorbLines[type]![0] : Infinity),
//                       Math.max(style[xy] + (xy === 'x' ? style.width : style.height), state.adsorbLines[type] ? state.adsorbLines[type]![1] : -Infinity)
//                     ];

//                     // 最近的ftr
//                     type2Dist[type].forEach((side) => {
//                       if (side === 'left' || side === 'top') {
//                         const p = style[xy] + style[widthHeight];
//                         const distDelt = state.border!.lt[xy] - p;
//                         if (distDelt >= adsorbDist) {
//                           if (!closestStyles[side] || (closestStyles[side]![xy] + closestStyles[side]![widthHeight] < p)) {
//                             closestStyles[side] = style;
//                           }
//                         }
//                       }
//                       if (side === 'right' || side === 'bottom') {
//                         const distDelt = style[xy] - state.border!.rb[xy];
//                         if (distDelt >= adsorbDist) {
//                           if (!closestStyles[side] || (style[xy] < closestStyles[side]![xy])) {
//                             closestStyles[side] = style;
//                           }
//                         }
//                       }
//                     });

//                   }
//                 }
//               });
//             });
//           });
//         }
//       });
//       // border计算完成后重新计算adsorbLines
//       Object.keys(state.adsorbLines).forEach((type) => {
//         const key = type2Key[type];
//         state.adsorbLines[type] = [
//           Math.min(state.border!.lt[key], state.adsorbLines[type] ? state.adsorbLines[type]![0] : Infinity),
//           Math.max(state.border!.rb[key], state.adsorbLines[type] ? state.adsorbLines[type]![1] : -Infinity)
//         ];
//       });

//       // 根据最近的ftrstyle计算distLines
//       Object.keys(closestStyles).forEach((side) => {
//         const xy = (side === 'left' || side === 'right') ? 'x' : 'y';
//         const widthHeight = xy === 'x' ? 'width' : 'height';
//         if (side === 'left' || side === 'top') {
//           state.distLines[side] = state.border!.lt[xy] - closestStyles[side]![widthHeight] - closestStyles[side]![xy];
//         }
//         if (side === 'right' || side === 'bottom') {
//           state.distLines[side] = closestStyles[side]![xy] - state.border!.rb[xy];
//         }
//       });

//       // 根据最近的ftrstyle计算dashlines
//       Object.keys(closestStyles).forEach((side) => {
//         const xy = (side === 'left' || side === 'right') ? 'y' : 'x';
//         const widthHeight = xy === 'x' ? 'width' : 'height';
//         const mid = (state.border!.lt[xy] + state.border!.rb[xy]) / 2;
//         if (mid > closestStyles[side]![xy] + closestStyles[side]![widthHeight]) {
//           state.dashLines[side] = [closestStyles[side]![xy] + closestStyles[side]![widthHeight], state.border!.rb[xy]];
//         } else if (mid < closestStyles[side]![xy]) {
//           state.dashLines[side] = [state.border!.lt[xy], closestStyles[side]![xy]];
//         } else {
//           delete state.dashLines[side];
//         }
//       });
//     }
//   }
//   return state;
// }

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
    isRotate: false,
    selectBox: null,
    isMousedown: false,
    resize: null,
    dragCompStyle: null,
    hoverFtr: null,
    guideBlocks: [],
    guideLines: []
  };
}

// 置为鼠标down
export function setMousedown({ getState }: ICtx, param: { canvasId: string; pos: IGrag.IPos; }) {
  const { pos, canvasId } = param;
  const state = { ...getState(), focusedCanvas: canvasId };
  // 计算 mousePos
  const canvasRect = state.canvasRects[canvasId];
  return {
    ...getState(),
    isMousedown: true,
    mousedownPos: util.roundObj({
      x: pos.x - canvasRect.x,
      y: pos.y - canvasRect.y
    })
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
      x: 0, y: 0, rotate: 0
    };
  }
  return {
    ...getState(),
    dragCompStyle
  };
}

// 准备resize
export function readyResize({ getState }: ICtx, resize: IGrag.IResize) {
  return {
    ...getState(),
    beforeChangeFtrStyles: { ...getState().ftrStyles },
    resize,
  };
}

// 准备rotate
export function readyRotate({ getState }: ICtx) {
  return {
    ...getState(),
    beforeChangeFtrStyles: { ...getState().ftrStyles },
    isRotate: true
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
export function updateSelectedFtrs({ getState, doAction }: ICtx, ftrIds: string[]) {
  doAction('updateState', {
    selectedFtrs: ftrIds
  });
  doAction('updateBorder');
  return getState();
}

// 更新cursor
export function updateCursor({ getState }: ICtx, cursor: string) {
  return {
    ...getState(),
    cursor
  };
}

// 更新state
export function updateState({ getState }: ICtx, state: Partial<IState>) {
  return {
    ...getState(),
    ...state
  };
}
