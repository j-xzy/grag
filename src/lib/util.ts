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

export function uuid() {
  return 'id' + Math.ceil((Math.random() * 100000)) + Math.ceil((Math.random() * 100000));
}
