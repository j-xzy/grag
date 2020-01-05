declare namespace IGrag {
  interface INode {
    component: React.FC | React.ComponentClass;
    // dom: HTMLElement;
    children: INode[];
  }
}