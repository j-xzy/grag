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
