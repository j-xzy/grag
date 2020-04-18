declare namespace IGrag {
  interface IFtrNode extends INode<IFtrNode> {
    compId: string;
    ftrId: string;
  }
  
  interface INode<T extends INode<T>> {
    parent: T | null;
    firstChild: T | null;
    prev: T | null;
    next: T | null;
  }
}
