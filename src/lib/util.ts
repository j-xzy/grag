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

export function getParentNode(node: IGrag.IFtrNode) {
  return node.parent;
}

export function getChildren<T extends IGrag.INode<T>>(root: T): T[] {
  const childs: T[] = [];
  let node = root.firstChild;
  while (node) {
    childs.push(node);
    node = node.next;
  }
  return childs;
}

export function getDeepChildren<T extends IGrag.INode<T>>(root: T): T[] {
  const childs: T[] = [];
  getChildren(root).forEach((node) => {
    childs.push(node, ...getDeepChildren(node));
  });
  return childs;
}

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

export function getLastChild<T extends IGrag.INode<T>>(parent: T) {
  let child = parent.firstChild;
  while (child && child.next) {
    child = child.next;
  }
  return child;
}

export function appendChild<T extends IGrag.INode<T>>(parent: T, child: T) {
  child.parent = parent;
  const lastChild = getLastChild(parent);
  if (!lastChild) {
    parent.firstChild = child;
  } else {
    lastChild.next = child;
    child.prev = lastChild;
  }
  child.next = null;
  return child;
}

export function removeNode<T extends IGrag.INode<T>>(node: T) {
  const parent = node.parent;
  if (!parent) {
    return;
  }
  if (parent.firstChild === node) {
    parent.firstChild = node.next;
    if (parent.firstChild) {
      parent.firstChild.prev = null;
    }
  } else {
    const prev = node.prev;
    const next = node.next;
    if (prev) {
      prev.next = next;
    }
    if (next) {
      next.prev = prev;
    }
  }
}

export function isInside(source: IGrag.IBaseStyle, target: IGrag.IBaseStyle) {
  if (source.x < target.x || source.y < target.y) {
    return false;
  }
  if ((source.x + source.width) > (target.x + target.width)) {
    return false;
  }
  if ((source.y + source.height) > (target.y + target.height)) {
    return false;
  }
  return true;
}

export function moveIn<T extends IGrag.INode<T>>(source: T, target: T) {
  removeNode(source);
  appendChild(target, source);
}

export function calMaxBox(styles: IGrag.IBaseStyle[]) {
  const box = {
    lt: { x: Infinity, y: Infinity },
    rb: { x: -Infinity, y: -Infinity }
  };

  styles.forEach((style) => {
    box.lt.x = Math.min(box.lt.x, style.x);
    box.lt.y = Math.min(box.lt.y, style.y);
    box.rb.x = Math.max(box.rb.x, style.x + style.width);
    box.rb.y = Math.max(box.rb.y, style.y + style.height);
  });
  return {
    x: box.lt.x,
    y: box.lt.y,
    width: box.rb.x - box.lt.x,
    height: box.rb.y - box.lt.y
  };
}

export function calBoundRect(style: IGrag.IBaseStyle, rotate: number) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const center = calCenterByStyle(style);
  calVertexByStyle(style)
    .map((p => ({ x: p.x - center.x, y: p.y - center.y })))
    .forEach((p) => {
      const v = vectorRotate(p, rotate);
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

export function calVertexByStyle(style: IGrag.IBaseStyle) {
  return [
    { x: style.x, y: style.y },
    { x: style.x + style.width, y: style.y },
    { x: style.x + style.width, y: style.y + style.height },
    { x: style.x, y: style.y + style.height }
  ];
}

export function calDegByTwoVector(a: IGrag.IVector, b: IGrag.IVector) {
  const ab = a.x * b.x + a.y * b.y;
  const al = Math.sqrt(a.x * a.x + a.y * a.y);
  const bl = Math.sqrt(b.x * b.x + b.y * b.y);
  const rad = Math.acos(ab / (al * bl));
  if (isNaN(rad)) {
    return 0;
  }
  const z = b.x * a.y - a.x * b.y;
  let deg = rad * 180 / Math.PI;
  if (z < 0) {
    deg = 360 - deg;
  }
  return deg;
}

export function vectorRotate(vectror: IGrag.IVector, rotate: number, unit: 'deg' | 'rad' = 'deg') {
  const rad = unit === 'rad' ? rotate : deg2Rad(rotate);
  return {
    x: vectror.x * Math.cos(rad) - vectror.y * Math.sin(rad),
    y: vectror.x * Math.sin(rad) + vectror.y * Math.cos(rad)
  };
}

export function rad2Deg(rad: number) {
  return rad * 180 / Math.PI;
}

export function deg2Rad(deg: number) {
  return deg * Math.PI / 180;
}

export function lowestCommonAncestor<T extends IGrag.INode<T>>(nodes: T[]) {
  if (nodes.length < 2) {
    return nodes[0];
  }
  return nodes.reduce((pre, next) => lowset(pre, next));

  function lowset<T extends IGrag.INode<T>>(source: T, target: T) {
    const ancestors: Set<T> = new Set();
    while (source) {
      ancestors.add(source);
      source = source.parent as any;
    }
    while (!ancestors.has(target)) {
      target = target.parent as any;
    }
    return target;
  }
}

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

export function calSelectedFtrs(mousePos: IGrag.IPos, mousedownCoord: IGrag.IPos, styles: Array<IGrag.IBaseStyle & { ftrId: string; }>) {
  const left = Math.min(mousePos.x, mousedownCoord.x);
  const right = Math.max(mousePos.x, mousedownCoord.x);
  const top = Math.min(mousePos.y, mousedownCoord.y);
  const bottom = Math.max(mousePos.y, mousedownCoord.y);
  const selectedFtrs: string[] = [];

  styles.forEach((style) => {
    const { x, y, height, width, ftrId } = style;
    if (x >= left && (x + width) <= right && y >= top && (y + height) <= bottom) {
      selectedFtrs.push(ftrId);
    }
  });
  return selectedFtrs;
}

export function calCenterByStyle(style: IGrag.IBaseStyle) {
  return {
    x: style.x + style.width / 2,
    y: style.y + style.height / 2
  };
}

export function uuid() {
  return 'id' + Math.ceil((Math.random() * 100000)) + Math.ceil((Math.random() * 100000));
}

export function parseRotate(str: string) {
  const result = /(?<=rotate\().*?(?=\))/.exec(str);
  return result ? parseFloat(result[0]) : 0;
}
