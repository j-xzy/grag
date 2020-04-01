declare namespace IGrag {
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

  interface IStyle {
    width: number;
    height: number;
    x: number;
    y: number;
    rotate?: number;
  }

  interface IAdsorption {
    ht: [number, number];
    hm: [number, number];
    hb: [number, number];
    vl: [number, number];
    vm: [number, number];
    vr: [number, number];
  }

  type IDistLines = Record<ISides, number>;
  type IDashLines = Record<ISides, [number, number]>;

  type ISides = 'left' | 'right' | 'top' | 'bottom';

  type IAdsorptionType = 'ht' | 'hm' | 'hb' | 'vl' | 'vm' | 'vr';

  interface IProviderConfig {
    color?: string;
    id?: string;
  }

  interface IHighLight {
    ftrId: string;
    id: string;
    color: string;
  }

  type IResizeType = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se';

  interface IBox {
    lt: IPos;
    rb: IPos;
  }

  type IGuideLineType = 'dist' | 'dash' | 'align';

  type IDirection = 'vertical' | 'horizontal';

  interface IGuideLine {
    type: IGuideLineType;
    pos: IPos;
    direction: IDirection;
    length: number;
  }
}
