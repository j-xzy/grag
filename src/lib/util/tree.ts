// tree工具函数

/**
 * 得到直系children
 */
export function getChildren<T extends IGrag.INode<T>>(root: T): T[] {
  const childs: T[] = [];
  let node = root.firstChild;
  while (node) {
    childs.push(node);
    node = node.next;
  }
  return childs;
}

/**
 * 得到所有children(深)
 */
export function getDeepChildren<T extends IGrag.INode<T>>(root: T): T[] {
  const childs: T[] = [];
  getChildren(root).forEach((node) => {
    childs.push(node, ...getDeepChildren(node));
  });
  return childs;
}

/**
 * 得到最后一个child
 */
export function getLastChild<T extends IGrag.INode<T>>(parent: T) {
  let child = parent.firstChild;
  while (child && child.next) {
    child = child.next;
  }
  return child;
}

/**
 * 追加一个child
 */
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

/**
 * 移除节点
 */
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

/**
 * 移动到另外一个节点下
 */
export function moveIn<T extends IGrag.INode<T>>(source: T, target: T) {
  removeNode(source);
  appendChild(target, source);
}

/**
 * 得到最近公共祖先节点
 */
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
