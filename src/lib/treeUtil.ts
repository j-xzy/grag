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
