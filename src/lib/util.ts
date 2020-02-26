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

export function uuid() {
  return 'id' + Math.ceil((Math.random() * 100000)) + Math.ceil((Math.random() * 100000));
}

export function calcFtrStateByStyle(param: IGrag.IFtrStyle): IGrag.IFtrState {
  const { width, height, x, y } = param;
  return {
    width, height,
    x, y,
    vl: x, 
    vm: x + Math.floor(width / 2),
    vr: x + width,
    ht: y,
    hm: y + Math.floor(height / 2),
    hb: y + height
  };
}
