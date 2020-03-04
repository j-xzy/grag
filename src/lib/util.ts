export function getNodeByFtrId(root: IGrag.INode, ftrId: string) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (node!.ftrId === ftrId) {
      return node;
    }
    node!.children.forEach((child) => {
      stack.push(child);
    });
  }
  return null;
}

export function getParentNodeByFtrId(root: IGrag.INode, ftrId: string) {
  const stack: IGrag.INode[] = [root];
  let parent: IGrag.INode | null = null;
  let index = -1;
  while (stack.length) {
    const node = stack.shift()!;
    for (let i = 0; i < node.children.length; ++i) {
      if (node.children[i].ftrId === ftrId) {
        parent = node;
        index = i;
        break;
      } else {
        stack.push(node.children[i]);
      }
    }
    if (parent) {
      break;
    }
  }
  if (parent) {
    return { node: parent, index };
  }
  return null;
}

export function getAllChildren(node: IGrag.INode): IGrag.INode[] {
  const childs: IGrag.INode[] = [];
  node.children.forEach((child) => {
    childs.push(child, ...getAllChildren(child));
  });
  return childs;
}

export function buildNode(param: { ftrId: string; compId: string; children?: IGrag.INode[] }): IGrag.INode {
  return {
    ftrId: param.ftrId,
    compId: param.compId,
    children: param.children ?? []
  };
}

export function appendChild(parent: IGrag.INode, child: IGrag.INode) {
  return parent.children.push(child);
}

export function uuid() {
  return 'id' + Math.ceil((Math.random() * 100000)) + Math.ceil((Math.random() * 100000));
}
