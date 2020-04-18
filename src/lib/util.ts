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

export function isInside(source: IGrag.IFtrStyle, target: IGrag.IFtrStyle) {
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

export function calRect(styles: IGrag.IFtrStyle[]) {
  const rect = {
    lt: { x: Infinity, y: Infinity },
    rb: { x: -Infinity, y: -Infinity }
  };

  styles.forEach((style) => {
    rect.lt.x = Math.min(rect.lt.x, style.x);
    rect.lt.y = Math.min(rect.lt.y, style.y);
    rect.rb.x = Math.max(rect.rb.x, style.x + style.width);
    rect.rb.y = Math.max(rect.rb.y, style.y + style.height);
  });
  return rect;
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

export function calResizeStyle(resizeType: IGrag.IResizeType, style: IGrag.IFtrStyle, delt: { deltX: number; deltY: number; }) {
  let { x, y, width, height } = style;
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
  return { width, height, x, y };
}

export function calSelectedFtrs(mouseCoord: IGrag.IXYCoord, mousedownCoord: IGrag.IXYCoord, states: Array<IGrag.IFtrStyle & { ftrId: string; }>) {
  const left = Math.min(mouseCoord.x, mousedownCoord.x);
  const right = Math.max(mouseCoord.x, mousedownCoord.x);
  const top = Math.min(mouseCoord.y, mousedownCoord.y);
  const bottom = Math.max(mouseCoord.y, mousedownCoord.y);
  const selectedFtrs: string[] = [];

  states.forEach((state) => {
    const { x, y, height, width, ftrId } = state;
    let xIn = false;
    let yIn = false;
    if ((x >= left && x <= right) || ((x + width) >= left && (x + width) <= right)) {
      xIn = true;
    }
    if ((left >= x && left <= (x + width)) || (right >= x && right <= (x + width))) {
      xIn = true;
    }
    if ((y >= top && y <= bottom) || ((y + height) >= top && (y + height) <= bottom)) {
      yIn = true;
    }
    if ((top >= y && top <= (y + height)) || (bottom >= y && bottom <= (y + height))) {
      yIn = true;
    }
    if (xIn && yIn) {
      selectedFtrs.push(ftrId);
    }
  });
  return selectedFtrs;
}

export function calRectByStyle(style: IGrag.IFtrStyle) {
  return {
    lt: {
      x: style.x,
      y: style.y
    },
    rb: {
      x: style.x + style.width,
      y: style.y + style.height
    }
  } as IGrag.IRect;
}

export function uuid() {
  return 'id' + Math.ceil((Math.random() * 100000)) + Math.ceil((Math.random() * 100000));
}
