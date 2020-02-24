declare namespace IGrag {
  interface ICompOption {
    allowChild?: boolean;
  }

  interface ICompInfo {
    option: ICompOption;
    Component: ICompFcClass;
  }

  interface ICompInfos {
    [compId: string]: ICompInfo;
  }

  interface IDomMap {
    [ftrid: string]: HTMLElement | null;
  }

  interface IRootMap {
    [canvasId: string]: IGrag.INode;
  }

  interface IFtrState {
    width: number;
    height: number;
    x: number;
    y: number;
  }
}
