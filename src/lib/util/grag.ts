// 业务耦合的工具函数
import * as mathUtil from './math';

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
  return {
    x: minX, y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
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
  // eslint-disable-next-line prefer-const
  let { x, y, width, height, rotate } = style;
  const deltX = mousePos.x - mousedownPos.x;
  const deltY = mousePos.y - mousedownPos.y;
  const result = {
    x, y, rotate,
    width, height
  };
  const deltZ = Math.sqrt(deltX * deltX + deltY * deltY);
  if (resizeIdx === 5) {
    const pts = calRotateRectVertex(style, style.rotate);
    const vector ={
      x: pts[2].x - pts[1].x,
      y: pts[2].y - pts[1].y
    };
    const foo = vector.x*deltX + vector.y*deltY;
    if (rotate > 180) {
      rotate = 360 - rotate;
    }
    const vector2 = {
      x: pts[3].x - pts[2].x,
      y: pts[3].y - pts[2].y
    };
    const vector3 = {
      x: mousedownPos.x - mousePos.x,
      y: mousedownPos.y - mousePos.y
    };
    let r = mathUtil.calDegByTwoVector(vector3,vector2);
    if (r > 90) {
      r = 180 - r;
    }
    result.height += Math.sin(mathUtil.deg2Rad(r)) * deltZ * foo / Math.abs(foo);
    const resizePts = calRotateRectVertex(result, result.rotate);
    const xx = pts[0].x - resizePts[0].x;
    const yy = pts[0].y - resizePts[0].y;
    result.x += xx;
    result.y += yy;
  }
  if (resizeIdx === 5) {
    //
  }
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
