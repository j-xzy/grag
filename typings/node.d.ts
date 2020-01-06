declare namespace IGrag {
  interface INode {
    component: IGrag.ICompFcClass;
    // dom: HTMLElement;
    children: INode[];
  }
}