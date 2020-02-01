declare namespace IGrag {
  interface INode {
    compId: string;
    ftrId: string;
    coord: IGrag.IXYCoord;
    children: INode[];
  }
}
