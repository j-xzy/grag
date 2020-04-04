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
 * 得到父亲节点
 */
export function getParentNode(node: IGrag.IFtrNode) {
  return node.parent;
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
 * 旋转后的四个顶点 
 */
export function calRotateRectVertex(rect: IGrag.IRect, rotate: number) {
  const center = calRectCenter(rect);
  const vertexs = calRectVertex(rect).map((v) => {
    const pt = mathUtil.vectorRotate({ x: v.x - center.x ,y: v.y - center.y }, rotate);
    return {
      x: pt.x + center.x,
      y: pt.y + center.y
    };
  });
  return vertexs;
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
export function rotateRect(rect: IGrag.IRect, rotate: number) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const center = calRectCenter(rect);
  calRectVertex(rect)
    .map((p => ({ x: p.x - center.x, y: p.y - center.y })))
    .forEach((p) => {
      const v = mathUtil.vectorRotate(p, rotate);
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
 * 计算矩形四个顶点
 */
export function calRectVertex(style: IGrag.IRect) {
  return [
    { x: style.x, y: style.y },
    { x: style.x + style.width, y: style.y },
    { x: style.x + style.width, y: style.y + style.height },
    { x: style.x, y: style.y + style.height }
  ];
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
 * @param resizeType resize类型
 * @param style 当前style
 * @param delt 偏移量
 */
export function calResizeStyle(resizeType: IGrag.IResizeType, style: IGrag.IStyle, delt: { deltX: number; deltY: number; }) {
  // eslint-disable-next-line prefer-const
  let { x, y, width, height, rotate } = style;
  const { deltX, deltY } = delt;
  if (resizeType === 'e') {
    width = width + deltX;
  }
  if (resizeType === 's') {
    height = height + deltY;
  }
  if (resizeType === 'n') {
    y = y + deltY;
    height = height - deltY;
  }
  if (resizeType === 'w') {
    x = x + deltX;
    width = width - deltX;
  }
  if (resizeType === 'se') {
    height = height + deltY;
    width = width + deltX;
  }
  if (resizeType === 'ne') {
    y = y + deltY;
    height = height - deltY;
    width = width + deltX;
  }
  if (resizeType === 'nw') {
    y = y + deltY;
    height = height - deltY;
    x = x + deltX;
    width = width - deltX;
  }
  if (resizeType === 'sw') {
    height = height + deltY;
    x = x + deltX;
    width = width - deltX;
  }
  return { width, height, x, y, rotate };
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
