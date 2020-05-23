// 业务耦合的工具函数
import * as mathUtil from './math';
import * as treeUtil from './tree';

/**
 * 根据id得到节点
 */
export function getNodeByFtrId(root: IGrag.IFtrNode, ftrId: string) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop()!;
    if (node.ftrId === ftrId) {
      return node;
    }
    if (node.firstChild) {
      stack.push(node.firstChild);
    }
    let next = node.next;
    while (next) {
      stack.push(next);
      next = next.next;
    }
  }
  return null;
}

/**
 * 构建空的ftrNode
 */
export function buildEmptyFtrNode(param: { ftrId: string; compId: string; }): IGrag.IFtrNode {
  return {
    ftrId: param.ftrId,
    compId: param.compId,
    parent: null,
    prev: null,
    next: null,
    firstChild: null
  };
}

/**
 * source是否在target内
 */
export function isInside(source: IGrag.IStyle, target: IGrag.IStyle) {
  const region = calRotateRectVertex(target, target.rotate);
  return calRotateRectVertex(source, source.rotate).every((pt) => mathUtil.pointInRegion(pt, region));
}

/**
 * 旋转后的4个顶点
 */
export function calRotateRectVertex(rect: IGrag.IRect, rotate: number) {
  const center = calRectCenter(rect);
  const vertexs = calRectVertex(rect).map((v) => {
    const pt = mathUtil.rotateVector({ x: v.x - center.x, y: v.y - center.y }, rotate);
    return {
      x: pt.x + center.x,
      y: pt.y + center.y
    };
  });
  return vertexs;
}

/**
 * 计算矩形4个顶点
 */
export function calRectVertex(rect: IGrag.IRect) {
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height }
  ];
}

/**
 * 计算ResizeHanlder相关state
 */
export function calResizeHandler(border: IGrag.IStyle, offset = 0) {
  const result = [];
  const xProduct = [0, 0.5, 1, 1, 1, 0.5, 0, 0];
  const yProduct = [0, 0, 0, 0.5, 1, 1, 1, 0.5];
  const originProduct = [[0.5, 0.5], [0, 0.5], [-0.5, 0.5], [-0.5, 0], [-0.5, - 0.5], [0, -0.5], [0.5, -0.5], [0.5, 0]];
  const types1: IGrag.IResizeType[] = ['nw', 'n', 'ne', 'ne', 'e', 'se', 'se', 's', 'sw', 'sw', 'w', 'nw'];
  const types2: IGrag.IResizeType[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  for (let idx = 0; idx < 8; ++idx) {
    const x = xProduct[idx] * border.width + border.x - offset;
    const y = yProduct[idx] * border.height + border.y - offset;
    const origin = [originProduct[idx][0] * border.width + offset, originProduct[idx][1] * border.height + offset] as [number, number];
    let type = types1[Math.floor(border.rotate / 30)];
    type = types2[(types2.indexOf(type) + idx) % 8];
    result.push({ x, y, origin, type });
  }
  return result;
}

/**
 * 计算所有矩形构成的最大矩形
 */
export function calMaxRect(rects: IGrag.IRect[]) {
  const box = {
    lt: { x: Infinity, y: Infinity },
    rb: { x: -Infinity, y: -Infinity }
  };

  rects.forEach((rect) => {
    box.lt.x = Math.min(box.lt.x, rect.x);
    box.lt.y = Math.min(box.lt.y, rect.y);
    box.rb.x = Math.max(box.rb.x, rect.x + rect.width);
    box.rb.y = Math.max(box.rb.y, rect.y + rect.height);
  });
  return {
    x: box.lt.x,
    y: box.lt.y,
    width: box.rb.x - box.lt.x,
    height: box.rb.y - box.lt.y
  };
}

/**
 * 旋转矩形后构成的最大的矩形 
 */
export function rotateRect(rect: IGrag.IRect, deg: number) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const center = calRectCenter(rect);
  calRectVertex(rect)
    .map((p => ({ x: p.x - center.x, y: p.y - center.y })))
    .forEach((p) => {
      const v = mathUtil.rotateVector(p, deg);
      minX = Math.min(minX, v.x + center.x);
      minY = Math.min(minY, v.y + center.y);
      maxX = Math.max(maxX, v.x + center.x);
      maxY = Math.max(maxY, v.y + center.y);
    });
  return roundObj({
    x: minX, y: minY,
    width: maxX - minX,
    height: maxY - minY
  });
}

export function style2MaxRect(style: IGrag.IStyle) {
  return rotateRect(style, style.rotate);
}

/**
 * @example parseRotate('rotate(123px)') => 123
 */
export function parseRotate(str: string) {
  const result = /(?<=rotate\().*?(?=\))/.exec(str);
  return result ? parseFloat(result[0]) : 0;
}

/**
 * 计算resize后的style
 */
export function calResizeStyle(resizeIdx: number, style: IGrag.IStyle, mousePos: IGrag.IPos, mousedownPos: IGrag.IPos) {
  const result = { ...style };
  const deltX = mousePos.x - mousedownPos.x;
  const deltY = mousePos.y - mousedownPos.y;
  const deltZ = Math.sqrt(deltX * deltX + deltY * deltY);
  const pts = calRotateRectVertex(style, style.rotate);

  let heightPositive = 1;
  let widthPositive = 1;
  if ([0, 1, 2].includes(resizeIdx)) {
    heightPositive = (pts[1].x - pts[2].x) * deltX + (pts[1].y - pts[2].y) * deltY;
  }
  if ([4, 5, 6].includes(resizeIdx)) {
    heightPositive = (pts[2].x - pts[1].x) * deltX + (pts[2].y - pts[1].y) * deltY;
  }
  if ([2, 3, 4].includes(resizeIdx)) {
    widthPositive = (pts[1].x - pts[0].x) * deltX + (pts[1].y - pts[0].y) * deltY;
  }
  if ([0, 6, 7].includes(resizeIdx)) {
    widthPositive = (pts[0].x - pts[1].x) * deltX + (pts[0].y - pts[1].y) * deltY;
  }
  heightPositive = heightPositive / Math.abs(heightPositive);
  widthPositive = widthPositive / Math.abs(widthPositive);

  let heightR = 0;
  let widthR = 0;
  if ([0, 2, 4, 6, 1, 5].includes(resizeIdx)) {
    heightR = mathUtil.calAngleByVectors({
      x: pts[2].x - pts[3].x,
      y: pts[2].y - pts[3].y
    }, {
      x: deltX,
      y: deltY
    });
  }
  if ([0, 2, 4, 6, 3, 7].includes(resizeIdx)) {
    widthR = mathUtil.calAngleByVectors({
      x: pts[1].x - pts[2].x,
      y: pts[1].y - pts[2].y
    }, {
      x: deltX,
      y: deltY
    });
  }
  if (heightR > Math.PI / 2) {
    heightR = Math.PI - heightR;
  }
  if (widthR > Math.PI / 2) {
    widthR = Math.PI - widthR;
  }

  if ([0, 2, 4, 6, 1, 5].includes(resizeIdx)) {
    result.height += Math.sin(heightR) * deltZ * heightPositive;
  }
  if ([0, 2, 4, 6, 3, 7].includes(resizeIdx)) {
    result.width += Math.sin(widthR) * deltZ * widthPositive;
  }

  let xx = 0;
  let yy = 0;
  const resizePts = calRotateRectVertex(result, result.rotate);
  if ([3, 4, 5].includes(resizeIdx)) {
    xx = pts[0].x - resizePts[0].x;
    yy = pts[0].y - resizePts[0].y;
  }
  if ([0, 1, 7].includes(resizeIdx)) {
    xx = pts[2].x - resizePts[2].x;
    yy = pts[2].y - resizePts[2].y;
  }
  if (resizeIdx === 2) {
    xx = pts[3].x - resizePts[3].x;
    yy = pts[3].y - resizePts[3].y;
  }
  if (resizeIdx === 6) {
    xx = pts[1].x - resizePts[1].x;
    yy = pts[1].y - resizePts[1].y;
  }
  result.x += xx;
  result.y += yy;

  return result;
}

/**
 * 被两点构成矩形所包裹的ftrs
 */
export function calSelectedFtrs(pos1: IGrag.IPos, pos2: IGrag.IPos, styles: Array<IGrag.IRect & { ftrId: string; }>) {
  const left = Math.min(pos1.x, pos2.x);
  const right = Math.max(pos1.x, pos2.x);
  const top = Math.min(pos1.y, pos2.y);
  const bottom = Math.max(pos1.y, pos2.y);
  const selectedFtrs: string[] = [];

  styles.forEach((style) => {
    const { x, y, height, width, ftrId } = style;
    if (x >= left && (x + width) <= right && y >= top && (y + height) <= bottom) {
      selectedFtrs.push(ftrId);
    }
  });
  return selectedFtrs;
}

/**
 * 计算矩形中心点
 */
export function calRectCenter(style: IGrag.IRect) {
  return {
    x: style.x + style.width / 2,
    y: style.y + style.height / 2
  };
}

/**
 * 得到uuid
 */
export function uuid() {
  return 'id' + Math.ceil((Math.random() * 100000)) + Math.ceil((Math.random() * 100000));
}

/**
 * @example {x: 1.1, width: 2.7} => {x: 1, width: 3}
 */
export function roundObj<T extends any>(obj: T): T {
  const result = { ...obj };
  for (const k in result) {
    if (typeof result[k] === 'number') {
      result[k] = Math.round(result[k]);
    }
  }
  return result;
}

/**
 * IFtrNode => IStraightFtrNode
 */
export function straightNode(ftrNode: IGrag.IFtrNode) {
  const node: IGrag.IStraightFtrNode = {
    ftrId: ftrNode.ftrId,
    compId: ftrNode.compId,
    children: treeUtil.getChildren(ftrNode).map(straightNode)
  };
  return node;
}

/**
 * IStraightFtrNode => IFtrNode
 */
export function unStraightNode(straightNode: IGrag.IStraightFtrNode, parent: IGrag.IFtrNode | null) {
  const root = buildEmptyFtrNode(straightNode);
  root.parent = parent;
  straightNode.children.reduce((prev, next) => {
    const node = unStraightNode(next, root);
    node.prev = prev;
    if (prev) {
      prev.next = node;
    } else {
      root.firstChild = node;
    }
    return node;
  }, null as IGrag.IFtrNode | null);
  return root;
}

/**
 * 计算两个矩形间距块与线（a、b不相交）
 */
export function calGuideBlockLine(aa: IGrag.IStyle | IGrag.IRect, bb: IGrag.IStyle | IGrag.IRect) {
  let horizontal = true;
  const a = rotateRect(aa, (aa as IGrag.IStyle).rotate ?? 0);
  const b = rotateRect(bb, (bb as IGrag.IStyle).rotate ?? 0);
  if (a.y > (b.y + b.height) || (a.y + a.height) < b.y) {
    horizontal = false;
  }
  const block: IGrag.IRect = {
    x: 0, y: 0,
    width: 0, height: 0
  };

  if (horizontal) {
    block.x = Math.min(a.x + a.width, b.x + b.width);
    block.y = Math.min(a.y, b.y);
    block.width = Math.max(a.x, b.x) - block.x;
    block.height = Math.max(a.y + a.height, b.y + b.height) - block.y;
  } else {
    block.x = Math.min(a.x, b.x);
    block.y = Math.min(a.y + a.height, b.y + b.height);
    block.width = Math.max(a.x + a.width, b.x + b.width) - block.x;
    block.height = Math.max(a.y, b.y) - block.y;
  }

  const dist: IGrag.IGuideLine = {
    type: 'dist',
    direction: horizontal ? 'horizontal' : 'vertical',
    pos: {
      x: horizontal ? block.x : block.x + block.width / 2,
      y: horizontal ? block.y + block.height / 2 : block.y
    },
    offset: -3,
    length: horizontal ? block.width : block.height
  };

  return { block, line: [dist] };
}

/**
 * 判断两个矩形是否有重合（在垂直或水平方向上）
 */
export function isCoincide(rects: [IGrag.IRect, IGrag.IRect], direction: IGrag.IDirection, zero = true) {
  const xy = direction === 'horizontal' ? 'x' : 'y';
  const wh = direction === 'horizontal' ? 'width' : 'height';
  const v1 = rects[0][xy] - rects[1][xy] - rects[1][wh];
  const v2 = rects[0][xy] + rects[0][wh] - rects[1][xy];
  if (zero) {
    return v1 * v2 <= 0;
  }
  return v1 * v2 < 0;
}

/**
 * 矩形对齐线
 * [[ht,hm,hb], [vl,vm,vr]]
 */
export function rectAlignLines(rect: IGrag.IRect): [[number, number, number], [number, number, number]] {
  return [
    [rect.y, rect.y + Math.ceil(rect.height / 2), rect.y + rect.height],
    [rect.x, rect.x + Math.ceil(rect.width / 2), rect.x + rect.width]
  ];
}

// /**
//  * 两个style的间距
//  * [horizontal, vertical]
//  */
// export function calSpaces(style1: IGrag.IStyle | IGrag.IRect, style2: IGrag.IStyle | IGrag.IRect) {
//   const s1 = rotateRect(style1, (style1 as IGrag.IStyle).rotate ?? 0);
//   const s2 = rotateRect(style2, (style2 as IGrag.IStyle).rotate ?? 0);
  
// }
