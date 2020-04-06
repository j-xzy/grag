declare namespace IGrag {
  interface IFtrNode extends INode<IFtrNode> {
    compId: string;
    ftrId: string;
  }

  interface ICompOption {
    allowChild?: boolean;
    width?: number;
    height?: number;
    img?: string;
  }

  interface ICompInfo {
    option: ICompOption;
    Component: ICompFcClass;
  }

  interface ICompInfos {
    [compId: string]: ICompInfo;
  }

  interface IDoms {
    [ftrid: string]: HTMLElement;
  }

  interface IRoots {
    [canvasId: string]: IFtrNode;
  }

  interface IStyle extends IRect {
    rotate: number;
  }

  interface IRect {
    width: number;
    height: number;
    x: number;
    y: number;
  }

  interface IProviderConfig {
    color?: string;
    id?: string;
  }

  interface IHighLight {
    ftrId: string;
    id: string;
    color: string;
  }

  type IResizeType = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

  type IGuideLineType = 'dist' | 'dash' | 'align';

  type IDirection = 'vertical' | 'horizontal';

  interface IGuideLine {
    type: IGuideLineType;
    pos: IPos;
    direction: 'vertical' | 'horizontal';
    length: number;
  }
}
