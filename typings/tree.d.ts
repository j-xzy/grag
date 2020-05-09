declare namespace IGrag {
  interface INode<T extends INode<T>> {
    parent: T | null;
    firstChild: T | null;
    prev: T | null;
    next: T | null;
  }
}
